import express from "express";

import controller from "../controllers/country.controller";

const countryRouter = express.Router();

countryRouter.get("/", controller.getCountries);

export default countryRouter;
