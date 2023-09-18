import express from "express";

import controller from "../controllers/bank.controller";

const bankRouter = express.Router();

bankRouter.get("/", controller.getBanks);
bankRouter.post("/resolve", controller.resolveAccount);

export default bankRouter;
