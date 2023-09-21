import { Queue } from "bullmq";
import { redisClient } from "../config/redis.config";

const emailQueue = new Queue("email", {
  connection: redisClient,
});

export default emailQueue;
