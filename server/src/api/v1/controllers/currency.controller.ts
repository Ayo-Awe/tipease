import { Request, Response } from "express";
import client from "../../../db";

class CurrencyController {
  // Simple demo of user auth
  async getCurrencies(req: Request, res: Response) {
    const currencies = await client.currency.findMany();

    res.ok({ currencies });
  }
}

export default new CurrencyController();
