import express from "express";

import controller from "../controllers/currency.controller";

const currencyRouter = express.Router();

currencyRouter.get("/", controller.getCurrencies);

export default currencyRouter;
