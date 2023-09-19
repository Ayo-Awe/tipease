import express from "express";

import meController from "../controllers/me.controller";
import { auth } from "../../middlewares/authMiddleware";
import uploadMiddleware from "../../../config/multer.config";
import pageController from "../controllers/page.controller";

const meRouter = express.Router();

// Welcome endpoint
meRouter.get("/", auth, meController.getAuthenticatedUser);
meRouter.patch("/", auth, meController.editUserProfile);
meRouter.put("/withdrawal-account", auth, meController.connectWithrawalAccount);
meRouter.get("/page", auth, pageController.getUserPage);
meRouter.post(
  "/page",
  auth,
  uploadMiddleware.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  pageController.createUserPage
);
meRouter.patch(
  "/page",
  auth,
  uploadMiddleware.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  pageController.editUserPage
);

meRouter.put("/page/status", auth, pageController.updatePageStatus);

export default meRouter;
