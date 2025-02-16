import { createReadStream } from "fs";
import { readFile } from "fs/promises";
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
  credentials: {
    accessKeyId: "aws",
    secretAccessKey: "aws",
  },
  // endpoint: "http://localhost:9000",
  // forcePathStyle: true,
});
const parts: CompletedPart[] = [];

(async () => {
  const bufferSizeInByte = 5 * 1024 * 1024; // 5MB (AWS minimum part size)
  const stream = createReadStream(fileName, {
    highWaterMark: bufferSizeInByte,
  });
  const fileContent = await readFile(fileName);
  const checksum = generateChecksum(fileContent, checksumAlgorithm);
  const createMultiPartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm, // If I comment this it will skip the whole checksum check all together!
    ChecksumType: "FULL_OBJECT", // Does not change anything if I choose FULL_OBJECT or COMPOSITE!
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
      // ChecksumAlgorithm: checksumAlgorithm,
      PartNumber: partNumber,
      Body: chunk,
      // ChecksumCRC32: chunkChecksum,
    });
    const response = await client.send(uploadPartCommand);

    console.log(response); // This line logs: { '$metadata': { ... }, ETag: '"21a2d7...1354f"', ChecksumCRC32: 'gp8EGg==' }

    parts.push({
      PartNumber: partNumber++,
      ETag: response.ETag,
      // And if I do not add the following, when I try to complete the upload AWS S3 will throw InvalidPart error at me!
      // And when I do add it, AWS will calculate a composite checksum!!!!
      // ChecksumCRC32: response.ChecksumCRC32,
    });
  }

  console.log("Parts: ", parts);

  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
    ChecksumType: "FULL_OBJECT", // if I uncomment these two AWS S3 will throw an error at me!
    ChecksumCRC32: checksum, // if I uncomment these two AWS S3 will throw an error at me!
  });
  const response = await client.send(command);

  console.log("AWS response: ");
  console.dir(response, { depth: null });
  console.log("My checksum: " + checksum);
})();
