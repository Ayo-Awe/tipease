import cors from "cors";
import express from "express";
import morgan from "morgan";

import * as errorMiddlewares from "./api/middlewares/errorMiddlewares";
import responseUtilities from "./api/middlewares/responseUtilities";
import v1Router from "./api/v1/routes";
import { conditionalMiddleware } from "./utils/expressHelpers";
import cookieParser from "cookie-parser";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import emailQueue from "./queues/email.queue";
import profileImageQueue from "./queues/profileImage.queue";
import path from "path";

const app = express();
const whitelist = ["http://localhost:3000"];

// Middlewares
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(emailQueue), new BullMQAdapter(profileImageQueue)],
  serverAdapter: serverAdapter,
});
app.use(responseUtilities);
app.use(
  // Clerk webhook verification won't work with express.json().
  // Read more here https://docs.svix.com/receiving/verifying-payloads/how#nodejs-express
  conditionalMiddleware(
    express.json(),
    (req) => !req.path.includes("/webhooks/clerk")
  )
);
app.use(cookieParser());
app.use(cors({ origin: whitelist }));
app.use(express.static(path.resolve("../client/dist")));
console.log(path.resolve("../client/dist"));
app.use(morgan("dev"));
app.use("/admin/queues", serverAdapter.getRouter());

// API routes
app.use("/api/v1", v1Router);

// Error middlewares
app.use(errorMiddlewares.errorLogger);
app.use(errorMiddlewares.errorHandler);

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("../client/dist", "index.html"));
});

// 404 Handler
app.use((req, res) => {
  res.error(404, "Resource not found", "UNKNOWN_ENDPOINT");
});

export default app;
