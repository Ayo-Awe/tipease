import { PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.config";
import { randomUUID } from "crypto";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

class S3Service {
  async uploadFile(filePath: string) {
    const key = randomUUID();
    const params: PutObjectCommandInput = {
      Bucket: "tipease",
      Key: key,
      ACL: "public-read",
      Body: await readFile(filePath),
    };

    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(data);

    return process.env.SPACES_CDN_ENDPOINT + "/" + key;
  }
}

export default new S3Service();
