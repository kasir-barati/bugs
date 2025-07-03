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
const filename = "upload-me.mp4";
const filePath = join(__dirname, filename);

async function test() {
  await generateLargeFile(filename, 250);
  const fileStream: ReadStream = createReadStream(filePath, {
    highWaterMark: 1024,
  });
  const stream = new PassThrough();
  const upload = new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: stream },
  });
  let counter = 0;

  for await (const data of fileStream) {
    console.log("Iteration: " + ++counter);
    stream.write(data);
  }

  // You will never see these logs!

  console.log("Before done!");
  memoryLogger();

  await upload.done();

  console.log("After done!");
  memoryLogger();
}

async function testWithDrain() {
  await generateLargeFile(filename, 250);
  const fileStream: ReadStream = createReadStream(filePath, {
    highWaterMark: 1024,
  });
  const stream = new PassThrough();
  const upload = new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: stream },
  });
  let counter = 0;

  for await (const data of fileStream) {
    console.log("Iteration: " + ++counter);
    const shouldWaitForDrainEvent = stream.write(data);

    if (shouldWaitForDrainEvent) {
      continue;
    }

    await new Promise<void>((resolve) => {
      console.log("Draining...");
      stream.on("drain", resolve);
    });
  }

  // You will never see these logs!

  console.log("Before done!");
  memoryLogger();

  await upload.done();

  console.log("After done!");
  memoryLogger();
}

/** @description NO memory issue! */
async function worksWhenWeAreNotUsingPassThrough() {
  await generateLargeFile(filename, 250);
  const fileStream: ReadStream = createReadStream(filePath, {
    highWaterMark: 1024,
  });
  const upload = new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: fileStream },
  });

  console.log("Before done!");
  memoryLogger();

  await upload.done();

  console.log("After done!");
  memoryLogger();
}

async function callsDoneImmediately() {
  await generateLargeFile(filename, 250);
  const fileStream: ReadStream = createReadStream(filePath, {
    highWaterMark: 1024,
  });
  const stream = new PassThrough();
  new Upload({
    client,
    params: { Bucket: bucket, Key: key, Body: stream },
  })
    .done()
    .then(console.log)
    .catch(console.error);

  for await (const data of fileStream) {
    stream.write(data, "utf-8");
  }

  console.log("Waiting for 2 minutes...");
  await new Promise<void>((resolve) => setTimeout(resolve, 2 * 60 * 1_000));
  console.log("After wait!");
}

void callsDoneImmediately();
