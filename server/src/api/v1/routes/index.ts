import express from "express";

import controller from "../controllers";
import webhookRouter from "./webhook.route";
import meRouter from "./me.route";
import authController from "../controllers/auth.controller";

const router = express.Router();

// Welcome endpoint
router.get("/", controller.welcomeHandler);
router.use("/webhooks", webhookRouter);
router.use("/me", meRouter);
router.post("/auth/mock", authController.mockLogin);

export default router;
