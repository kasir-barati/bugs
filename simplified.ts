import { createReadStream } from "fs";
import { readFile } from "fs/promises";
import { checksums } from "aws-crt";
import {
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { generateChecksum } from "./generate-checksum";

let partNumber = 1;
const bucket = "test";
const key = randomUUID();
const fileName = "upload-me.mp4";
const checksumAlgorithm = ChecksumAlgorithm.CRC32;
const client = new S3Client({
  region: "eu",
  credentials: { accessKeyId: "adminadmin", secretAccessKey: "adminadmin" },
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});
const parts: CompletedPart[] = [];

(async () => {
  const bufferSizeInByte = 5 * 1024 * 1024; // 5MB (AWS minimum part size)
  const stream = createReadStream(fileName, {
    highWaterMark: bufferSizeInByte,
  });
  const fileContent = await readFile(fileName, {
    encoding: "binary",
  });
  const checksumNumber = checksums.crc32(fileContent);
  const checksum = Buffer.from(checksumNumber.toString()).toString("base64");
  const createMultiPartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm,
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

  const uploadId = createMultiPartUploadResponse.UploadId;

  for await (const chunk of stream) {
    // You can optionally compute the checksum in your code making sure that if something was altered in between AWS will fail that chunk upload.
    // const chunkChecksum = generateChecksum(chunk, checksumAlgorithm);

    const uploadPartCommand = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      ChecksumAlgorithm: checksumAlgorithm,
      PartNumber: partNumber,
      Body: chunk,
      // ChecksumCRC32: chunkChecksum,
    });
    const response = await client.send(uploadPartCommand);

    parts.push({
      PartNumber: partNumber++,
      ETag: response.ETag,
      ChecksumCRC32: response.ChecksumCRC32,
    });
  }

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
    ChecksumType: "FULL_OBJECT",
    ChecksumCRC32: checksum,
  });
  const response = await client.send(command);

  console.log(response.ETag);
})();
