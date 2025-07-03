import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "crypto";
import { createReadStream, ReadStream } from "fs";
import { join } from "path";
import { PassThrough } from "stream";
import { generateLargeFile } from "./auto-gen-file";
import { memoryLogger } from "./memory-logger";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MINIO_ACCESS_KEY: string;
      MINIO_SECRET_KEY: string;
    }
  }
}

console.log("Before upload!");
memoryLogger();

const client = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  endpoint: "http://minio:9000",
  forcePathStyle: true,
});
const key = randomUUID();
const bucket = "test";

(async () => {
  const filename = "upload-me.mp4";
  await generateLargeFile(filename, 250);
  const filePath = join(__dirname, filename);
  const fileStream: ReadStream = createReadStream(filePath);
  const stream = new PassThrough();

  fileStream.pipe(stream);

  const upload = new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: stream },
  });

  console.log("Before done!");
  memoryLogger();

  await upload.done();

  console.log("After done!");
  memoryLogger();
})();
