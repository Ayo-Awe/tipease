import express from "express";

import controller from "../controllers/me.controller";
import { auth } from "../../middlewares/authMiddleware";
import uploadMiddleware from "../../../config/multer.config";

const meRouter = express.Router();

// Welcome endpoint
meRouter.get("/", auth, controller.getAuthenticatedUser);
meRouter.patch("/", auth, controller.editUserProfile);
meRouter.get("/page", auth, controller.getUserPage);
meRouter.post(
  "/page",
  auth,
  uploadMiddleware.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.createUserPage
);
meRouter.patch(
  "/page",
  auth,
  uploadMiddleware.fields([
    { name: "profile", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  controller.editPage
);

meRouter.put("/page/status", auth, controller.updatePageStatus);

export default meRouter;
