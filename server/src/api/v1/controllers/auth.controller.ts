import { Request, Response } from "express";
import clerkClient from "@clerk/clerk-sdk-node";

class AuthController {
  // Simple demo of user auth
  async mockLogin(req: Request, res: Response) {
    const sessions = await clerkClient.sessions.getSessionList({
      userId: req.body.id,
      status: "active",
    });

    const response = await clerkClient.sessions.getToken(
      sessions[0].id,
      "test_template"
    );

    res.ok({ response });
  }
}

export default new AuthController();
