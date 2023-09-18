import { Request, Response } from "express";
import client from "../../../db";
import * as validator from "../validators/bank.validator";
import paystackService from "../../../services/paystack.service";
import { BadRequest, ServerError } from "../../../errors/httpErrors";

class BankController {
  // Simple demo of user auth
  async getBanks(req: Request, res: Response) {
    let { country = "nigeria" } = req.query;

    if (typeof country !== "string") {
      country = "nigeria";
    }

    console.log(country);

    const isValid = await client.country.findFirst({
      where: { name: { equals: country, mode: "insensitive" } },
    });

    if (!isValid) {
      return res.ok({ banks: [] });
    }

    const banks = await paystackService.getAllBanks(country);

    res.ok({ banks });
  }

  async resolveAccount(req: Request, res: Response) {
    const { data, error } = validator.resolveBankValidator(req.body);

    if (error) {
      throw new BadRequest(error.message, error.code);
    }

    const resolution = await paystackService.resolveBank(
      data.accountNumber,
      data.bankCode
    );

    if (!resolution) {
      throw new BadRequest(
        "Could not resolve this account",
        "INVALID_REQUEST_PARAMETERS"
      );
    }

    res.ok({ account: resolution });
  }
}

export default new BankController();
