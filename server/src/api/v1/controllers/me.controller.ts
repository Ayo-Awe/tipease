import { Request, Response } from "express";

class WebhookController {
  // Simple demo of user auth
  async getAuthenticatedUser(req: Request, res: Response) {
    res.ok({ user: req.user });
  }
}

export default new WebhookController();
