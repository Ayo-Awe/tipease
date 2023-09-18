import { Request, Response } from "express";
import client from "../../../db";

class CountryController {
  // Simple demo of user auth
  async getCountries(req: Request, res: Response) {
    const countries = await client.country.findMany();

    res.ok({ countries });
  }
}

export default new CountryController();
