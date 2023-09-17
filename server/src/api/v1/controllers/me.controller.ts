import { Request, Response } from "express";
import client from "../../../db";
import * as validator from "../validators/me.validator";
import {
  BadRequest,
  Conflict,
  Forbidden,
  ResourceNotFound,
  Unprocessable,
} from "../../../errors/httpErrors";
import profileImageQueue from "../../../queues/profileImage.queue";

class MeController {
  // Simple demo of user auth
  async getAuthenticatedUser(req: Request, res: Response) {
    const { id } = req.user!;

    const user = await client.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.ok({ user });
  }

  async editUserProfile(req: Request, res: Response) {
    const { id } = req.user!;
    const { data, error } = validator.editProfileValidator(req.body);

    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    await client.user.update({ where: { id }, data });

    res.noContent();
  }

  async getUserPage(req: Request, res: Response) {
    const { id } = req.user!;

    const page = await client.page.findFirst({
      where: { userId: id },
      include: {
        tipCurrency: {
          select: { name: true, code: true, minimumTipAmount: true },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      throw new ResourceNotFound("User has no page", "RESOURCE_NOT_FOUND");
    }

    res.ok({ page });
  }

  async createUserPage(req: Request, res: Response) {
    const { id } = req.user!;

    // A user can only have one page
    const existingPage = await client.page.findFirst({ where: { userId: id } });
    if (existingPage) {
      throw new Conflict("User already has a page", "EXISTING_USER_PAGE");
    }

    if (!req.files || Array.isArray(req.files) || !req.files.profile) {
      throw new BadRequest(
        "Profile image is required",
        "MISSING_REQUIRED_FIELD"
      );
    }

    // Validate request body
    const { data, error } = validator.createPageValidator(req.body);
    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    // Validate currency id
    const currency = await client.currency.findFirst({
      where: { id: data.tipCurrencyId },
    });

    if (!currency) {
      throw new Unprocessable(
        "Cannot process request due to invalid currency",
        "UNPROCESSABLE"
      );
    }

    if (data.pricePerToken < currency.minimumTipAmount) {
      throw new BadRequest(
        "Price per token must be greater or equal to minimum tip amount.",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    const existingSlug = await client.page.findFirst({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      throw new BadRequest(
        "Slug is not available",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    // Create page and add images to upload queue
    const page = await client.page.create({ data: { ...data, userId: id } });
    await profileImageQueue.add("profile upload", {
      profileImage: req.files.profile[0],
      bannerImage: req.files.banner?.at(0),
      pageId: page.id,
    });

    res.created({ page });
  }

  async updatePageStatus(req: Request, res: Response) {
    const { id } = req.user!;

    const { data, error } = validator.editPageStatus(req.body);
    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    if (!req.user!.activatedAt) {
      throw new Forbidden(
        "Cannot edit page status until user account is activated.",
        "ACCOUNT_NOT_ACTIVATED"
      );
    }

    const page = await client.page.findFirst({
      where: { userId: id },
      include: {
        user: { select: { subaccount: true } },
      },
    });

    if (!page) {
      throw new ResourceNotFound("User has no page", "RESOURCE_NOT_FOUND");
    }

    let updatedPage;
    if (data.status === "enabled") {
      updatedPage = await client.page.update({
        where: { id: page.id },
        data: { isActive: true },
      });
    } else {
      updatedPage = await client.page.update({
        where: { id: page.id },
        data: { isActive: false },
      });
    }

    res.ok({ page: updatedPage });
  }

  async editPage(req: Request, res: Response) {
    const { id } = req.user!;

    const { data, error } = validator.editPage(req.body);
    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    // Check for conflicting slugs
    if (data.slug) {
      const existingSlug = await client.page.findFirst({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        throw new BadRequest(
          "Slug is not available",
          "INVALID_REQUEST_PARAMETERS"
        );
      }
    }

    // Check if tip currency id is valid
    if (data.tipCurrencyId) {
      const currency = await client.currency.findFirst({
        where: { id: data.tipCurrencyId },
      });

      if (!currency) {
        throw new Unprocessable(
          "Cannot process request due to invalid currency",
          "UNPROCESSABLE"
        );
      }
    }

    const updatedPage = await client.page.update({
      where: { userId: id },
      data,
    });

    if (!updatedPage) {
      throw new ResourceNotFound("User has no page", "RESOURCE_NOT_FOUND");
    }

    // Update page profile image and banner image if specified
    if (
      !Array.isArray(req.files) &&
      (req.files?.profile || req.files?.banner)
    ) {
      await profileImageQueue.add("profile upload", {
        profileImage: req.files.profile?.at(0),
        bannerImage: req.files.banner?.at(0),
        pageId: updatedPage.id,
      });
    }

    res.ok({ page: updatedPage });
  }
}

export default new MeController();
