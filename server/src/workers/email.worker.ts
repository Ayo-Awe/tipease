import { Worker, Job } from "bullmq";
import { mailgunClient } from "../config/mailgun.config";
import { redisClient } from "../config/redis.config";

export interface EmailJobData {
  from?: string;
  to: string;
  subject: string;
  template: string;
  variables?: object;
}

export const emailWorker = new Worker("email", jobHandler, {
  useWorkerThreads: true,
  autorun: false,
  connection: redisClient,
});

emailWorker.on("ready", () => {
  console.log("Email worker started successfully");
});

emailWorker.on("error", (error) => {
  console.log("email worker:", error);
});

async function jobHandler(job: Job<EmailJobData>) {
  const messageData = {
    from: job.data.from || process.env.MAILGUN_SENDER_EMAIL,
    to: job.data.to,
    subject: job.data.subject,
    template: job.data.template,
    "t:variables": JSON.stringify(job.data.variables),
  };

  return mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, messageData);
}
