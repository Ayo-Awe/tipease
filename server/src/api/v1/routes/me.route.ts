import express from "express";
import { RequireAuthProp } from "@clerk/clerk-sdk-node";

import controller from "../controllers/me.controller";
import { auth } from "../../middlewares/authMiddleware";

const meRouter = express.Router();

// Welcome endpoint
meRouter.get("/", auth, controller.getAuthenticatedUser);

export default meRouter;
