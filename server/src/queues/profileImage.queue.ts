import { Queue } from "bullmq";

const profileImageQueue = new Queue("profileImage", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});

export default profileImageQueue;
