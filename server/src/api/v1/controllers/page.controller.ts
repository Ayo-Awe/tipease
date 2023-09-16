import { Request, Response } from "express";
import client from "../../../db";
import * as validator from "../validators/me.validator";
import { BadRequest, ResourceNotFound } from "../../../errors/httpErrors";

class PageController {
  // Simple demo of user auth
  async getPageBySlug(req: Request, res: Response) {
    const { slug } = req.params;
    const page = await client.page.findFirst({
      where: { slug },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        tipCurrency: {
          select: {
            name: true,
            code: true,
            minimumTipAmount: true,
          },
        },
      },
    });

    if (!page) {
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
}

export default new PageController();
