import { Queue } from "bullmq";
import { redisClient } from "../config/redis.config";

const profileImageQueue = new Queue("profileImage", {
  connection: redisClient,
});

export default profileImageQueue;
