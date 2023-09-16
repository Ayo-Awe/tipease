import express from "express";

import controller from "../controllers/page.controller";

const pageRouter = express.Router();

// Welcome endpoint
pageRouter.get("/:slug", controller.getPageBySlug);
pageRouter.get("/:slug/availability", controller.checkSlugAvailability);

export default pageRouter;
