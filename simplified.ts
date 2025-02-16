import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { generateChecksum } from "./generate-checksum";
import { isIn } from "class-validator";

let partNumber = 1;
let uploadId: string | undefined;
const bucket = "test";
const key = randomUUID();
const fileName = "upload-me.mp4";
const checksumAlgorithm = ChecksumAlgorithm.CRC32;
const client = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: "adminadmin",
    secretAccessKey: "adminadmin",
  },
  // Just needed in Minio
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});
const parts: CompletedPart[] = [];

(async () => {
  if (
    isIn(checksumAlgorithm, [ChecksumAlgorithm.SHA1, ChecksumAlgorithm.SHA256])
  ) {
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html#Full-object-checksums
    throw "AWS S3 due to technical reasons only supports CRC-based checksum checks!";
  }

  const bufferSizeInByte = 5 * 1024 * 1024; // 5MB (AWS minimum part size)
  const stream = createReadStream(fileName, {
    highWaterMark: bufferSizeInByte,
  });
  const fileContent = await readFile(fileName);
  const checksum = generateChecksum(fileContent, checksumAlgorithm);
  const createMultiPartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm,
    // In Minio, this config option does not change anything if I choose FULL_OBJECT or COMPOSITE.
    ChecksumType: "FULL_OBJECT",
    ContentType: "video/mp4",
    ContentDisposition: `attachment; filename="${fileName}"`,
  });
  const createMultiPartUploadResponse = await client.send(
    createMultiPartUploadCommand
  );

  if (!createMultiPartUploadResponse.UploadId) {
    throw "UploadId is missing";
  }

  uploadId = createMultiPartUploadResponse.UploadId;

  for await (const chunk of stream) {
    // You can optionally compute the checksum in your code making sure that if something was altered in between AWS will fail that chunk upload.
    // const chunkChecksum = generateChecksum(chunk, checksumAlgorithm);

    const uploadPartCommand = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      PartNumber: partNumber,
      Body: chunk,
      // Only needed if you wanted to perform COMPOSITE checksum check.
      // ChecksumAlgorithm: checksumAlgorithm,
      // ChecksumCRC32: chunkChecksum,
    });
    const response = await client.send(uploadPartCommand);

    console.log(response); // This line logs: { '$metadata': { ... }, ETag: '"21a2d7...1354f"', ChecksumCRC32: 'gp8EGg==' }

    parts.push({
      PartNumber: partNumber++,
      ETag: response.ETag,
      // And if I do not add the following, when I try to complete the upload Minio will throw InvalidPart error at me!
      // And when I do add it, Minio will calculate a composite checksum!!!!
      // ChecksumCRC32: response.ChecksumCRC32,
    });
  }

  console.log("Parts: ", parts);

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
    ChecksumType: "FULL_OBJECT",
    ChecksumCRC32: checksum,
  });
  const response = await client.send(command);

  console.log("AWS response: ");
  console.dir(response, { depth: null });
  console.log("My checksum: " + checksum);
})().catch(async (error) => {
  // In case of error clean up your S3 bucket, but this should not be a reason to not configure a lifecycle rule: https://stackoverflow.com/a/53634176/8784518
  console.log({
    uploadId,
    bucket,
    key,
    fileName,
    checksumAlgorithm,
  });

  if (!uploadId) {
    throw error;
  }

  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
  });

  await client.send(command);

  throw error;
});
