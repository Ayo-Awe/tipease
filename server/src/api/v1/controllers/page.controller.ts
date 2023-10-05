import { Request, Response } from "express";
import client from "../../../db";
import {
  BadRequest,
  Conflict,
  Forbidden,
  ResourceNotFound,
} from "../../../errors/httpErrors";
import profileImageQueue from "../../../queues/profileImage.queue";
import * as validator from "../validators/page.validator";

class PageController {
  // Simple demo of user auth
  async getPageBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const page = await client.page.findFirst({
      where: { slug },
      include: {
        user: {
          select: {
            activatedAt: true,
            firstName: true,
            lastName: true,
            paymentCurrency: true,
            pricePerToken: true,
          },
        },
      },
    });

    if (!page || !page.user.activatedAt || !page.isActive) {
      throw new ResourceNotFound("Page not found", "RESOURCE_NOT_FOUND");
    }

    res.ok({ page });
  }

  async checkSlugAvailability(req: Request, res: Response) {
    const { slug } = req.params;

    const page = await client.page.findFirst({ where: { slug } });

    if (page) {
      throw new ResourceNotFound("Slug unavailable", "RESOURCE_NOT_FOUND");
    }

    res.noContent();
  }

  async getUserPage(req: Request, res: Response) {
    const { id } = req.user!;

    const page = await client.page.findFirst({
      where: { userId: id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            paymentCurrency: {
              select: {
                code: true,
                name: true,
              },
            },
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
    const page = await client.page.create({
      data: { ...data, userId: id, isActive: Boolean(req.user?.activatedAt) },
    });

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

  async editUserPage(req: Request, res: Response) {
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

export default new PageController();
