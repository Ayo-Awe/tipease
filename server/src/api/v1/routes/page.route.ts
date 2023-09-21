import express from "express";

import controller from "../controllers/page.controller";
import tipController from "../controllers/tip.controller";

const pageRouter = express.Router();

// Welcome endpoint
pageRouter.get("/:slug", controller.getPageBySlug);
pageRouter.get("/:slug/availability", controller.checkSlugAvailability);
pageRouter.post("/:slug/tips", tipController.createTip);

export default pageRouter;
