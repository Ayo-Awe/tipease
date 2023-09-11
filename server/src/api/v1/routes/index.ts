import express from "express";

import controller from "../controllers";
import webhookRouter from "./webhook.route";
import meRouter from "./me.route";

const router = express.Router();

// Welcome endpoint
router.get("/", controller.welcomeHandler);
router.use("/webhooks", webhookRouter);
router.use("/me", meRouter);

export default router;
