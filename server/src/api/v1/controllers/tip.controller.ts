import { Request, Response } from "express";
import * as validator from "../validators/tip.validator";
import paystackService, {
  InitiateTipPaymentOptions,
} from "../../../services/paystack.service";
import {
  BadRequest,
  ResourceNotFound,
  ServerError,
} from "../../../errors/httpErrors";
import client from "../../../db";
import moment from "moment";
import { paginate } from "../../../utils/expressHelpers";

class TipController {
  async createTip(req: Request, res: Response) {
    const { slug } = req.params;
    const { data, error } = validator.createTipValidator(req.body);

    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    const page = await client.page.findFirst({
      where: { slug, isActive: true },
      include: {
        user: {
          select: {
            paymentCurrency: true,
            subaccount: true,
            pricePerToken: true,
          },
        },
      },
    });

    if (!page) {
      throw new ResourceNotFound("Page not found", "RESOURCE_NOT_FOUND");
    }

    const { user } = page;

    // User account must be properly activated
    if (!user.subaccount || !user.paymentCurrency || !user.pricePerToken) {
      // todo: replace with proper logging
      console.error(
        `Missing subaccount, paymentCurrency or price per token on activated page. pageId: ${page.id}`
      );
      throw new ServerError(
        "An unexpected error occured. Please contact the developers",
        "UNEXPECTED_ERROR"
      );
    }

    const duplicateReference = await client.tip.findFirst({
      where: { reference: data.reference },
    });

    if (duplicateReference) {
      throw new BadRequest(
        "Conflicting reference: reference must be unique",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    const options: InitiateTipPaymentOptions = {
      amount: data.tokenCount * user.pricePerToken,
      email: data.email,
      subaccount: user.subaccount,
      currency: user.paymentCurrency.code,
      reference: data.reference,
      callback_url: data.redirectUrl,
      metadata: {
        tokenCount: data.tokenCount,
        userId: page.userId,
        message: data.message,
      },
    };

    const paymentLink = await paystackService.initiateTipPayment(options);

    if (!paymentLink) {
      throw new ServerError(
        "An error occured with a thirdy party payment service",
        "THIRD_PARTY_API_FAILURE"
      );
    }

    res.ok({ paymentLink });
  }

  async getTipSummary(req: Request, res: Response) {
    const { user } = req;

    // I'm assuming that the user cannot change their tip currency
    const allTimeEarnings = await client.tip.aggregate({
      _sum: { amount: true },
      where: { userId: user!.id },
    });

    const tipCount = await client.tip.count({
      where: { userId: user!.id },
    });

    const last30DaysEarnings = await client.tip.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        createdAt: {
          lte: moment().toDate(),
          gt: moment().subtract(30, "days").toDate(),
        },
      },
    });

    const last90DaysEarnings = await client.tip.aggregate({
      _sum: { amount: true },
      where: {
        userId: user!.id,
        createdAt: {
          lte: moment().toDate(),
          gt: moment().subtract(90, "days").toDate(),
        },
      },
    });

    const earningsSummary = {
      allTime: allTimeEarnings._sum.amount,
      last30Days: last30DaysEarnings._sum.amount,
      last90Days: last90DaysEarnings._sum.amount,
    };

    res.ok({ earningsSummary, tipCount });
  }

  async getTips(req: Request, res: Response) {
    let { query } = req;

    const user = req.user!;

    // todo: Use a cursor
    const {
      limit: take,
      offset: skip,
      page,
    } = paginate(query.page, query.perPage);

    const tips = await client.tip.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: { currency: true },
    });

    // todo: add next, previous
    res.ok({ tips }, { page });
  }
}

export default new TipController();
