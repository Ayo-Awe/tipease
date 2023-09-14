import { Worker, Job } from "bullmq";
import { Page } from "@prisma/client";
import profileImageQueue from "../queues/profileImage.queue";
import { randomUUID } from "crypto";
import client from "../db";
import s3Service from "../services/s3.service";

export interface ProfileImageJobData {
  profileImage?: Express.Multer.File;
  bannerImage?: Express.Multer.File;
  pageId: Page["id"];
}

export const profileImageWorker = new Worker(
  profileImageQueue.name,
  jobHandler,
  {
    // useWorkerThreads: true,
    autorun: false,
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  }
);

profileImageWorker.on("ready", () => {
  console.log("Profile Image worker started successfully");
});

profileImageWorker.on("error", (e) => console.log(e));

async function jobHandler(job: Job<ProfileImageJobData>) {
  const { profileImage, bannerImage, pageId } = job.data;

  if (!bannerImage && !profileImage) {
    throw new Error("Banner Image and Profile Image are undefined");
  }

  if (!pageId) {
    throw new Error("pageId is undefined");
  }

  const page = await client.page.findFirst({ where: { id: pageId } });
  if (!page) {
    throw new Error(`Page: ${pageId} not found`);
  }

  let bannerUrl, profileUrl;

  if (bannerImage) {
    bannerUrl = await s3Service.uploadFile(bannerImage.path);
  }

  if (profileImage) {
    profileUrl = await s3Service.uploadFile(profileImage.path);
  }

  await client.page.update({
    where: { id: pageId },
    data: {
      bannerImage: bannerUrl,
      profileImage: profileUrl,
    },
  });
}
