import { Request, Response } from "express";
import client from "../../../db";
import * as validator from "../validators/me.validator";
import { BadRequest, ServerError } from "../../../errors/httpErrors";
import paystackService from "../../../services/paystack.service";
import { stringifyArray } from "../../../utils/commonHelpers";

class MeController {
  // Simple demo of user auth
  async getAuthenticatedUser(req: Request, res: Response) {
    const { id } = req.user!;

    const user = await client.user.findFirst({
      where: { id },
      select: {
        page: true,
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountNumber: true,
        bankName: true,
        accountName: true,
        pricePerToken: true,
        paymentCurrency: true,
        activatedAt: true,
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

    if (data.pricePerToken) {
      // User account must be activated
      if (!req.user?.activatedAt || !req.user.paymentCurrencyId) {
        throw new BadRequest(
          "Cannot update price per token because user is not activated.",
          "INVALID_REQUEST_PARAMETERS"
        );
      }

      const paymentCurrency = await client.currency.findFirst({
        where: { id: req.user.paymentCurrencyId },
      });

      // Per per token must be in allowed tip amounts
      if (!paymentCurrency?.allowedTipAmounts.includes(data.pricePerToken)) {
        throw new BadRequest(
          `Price per token must be one of ${stringifyArray(
            paymentCurrency!.allowedTipAmounts
          )}`,
          "INVALID_REQUEST_PARAMETERS"
        );
      }
    }

    await client.user.update({ where: { id }, data });

    res.noContent();
  }

  async connectWithrawalAccount(req: Request, res: Response) {
    const { user } = req;
    const { data, error } = validator.connectBankValidator(req.body);

    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    const currency = await client.currency.findFirst({
      where: { code: { equals: data.currency, mode: "insensitive" } },
    });

    if (!currency) {
      throw new BadRequest(
        "Currency is not supported",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    // Currency country must be same as bank country
    const bank = await paystackService.getBank(currency.country, data.bankCode);
    if (!bank) {
      throw new BadRequest(
        "Invalid bank code or bank doesn't support this currency. \
        Bank country and currency country must match.",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    const bankResolution = await paystackService.resolveBank(
      data.accountNumber,
      data.bankCode
    );

    if (!bankResolution) {
      throw new BadRequest(
        "Couldn't resolve bank details",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    // User is trying to connect the same account
    if (bankResolution.account_number === user!.accountNumber) {
      return res.noContent();
    }

    let subaccount;

    if (user?.subaccount) {
      subaccount = await paystackService.updateSubaccount(user.subaccount, {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
      });
    } else {
      subaccount = await paystackService.createSubaccount({
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        userId: user!.id,
      });
    }

    if (!subaccount) {
      throw new ServerError(
        "An error occured with our third party payment provider",
        "THIRD_PARTY_API_FAILURE"
      );
    }

    const page = await client.page.findFirst({
      where: { userId: user!.id },
    });

    // Add withdrawal account and activate page and user account
    await client.user.update({
      data: {
        accountNumber: data.accountNumber,
        bankCode: data.bankCode,
        accountName: bankResolution.account_name,
        bankName: subaccount.settlement_bank,
        paymentCurrencyId: currency.id,
        pricePerToken: currency.defaultTipAmount,
        activatedAt: user?.activatedAt || new Date(),
        subaccount: subaccount.subaccount_code,
        page: page
          ? {
              update: { isActive: true },
            }
          : undefined,
      },
      where: { id: user!.id },
    });

    res.noContent();
  }
}

export default new MeController();
