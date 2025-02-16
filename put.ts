import { readFile } from "fs/promises";
import {
  ChecksumAlgorithm,
  CompletedPart,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { generateChecksum } from "./generate-checksum";

const bucket = "test";
const key = randomUUID();
const fileName = "upload-me.mp4";
const checksumAlgorithm = ChecksumAlgorithm.SHA256;
const client = new S3Client({
  region: "eu",
  credentials: { accessKeyId: "adminadmin", secretAccessKey: "adminadmin" },
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});
const parts: CompletedPart[] = [];

(async () => {
  const fileContent = await readFile(fileName);
  const checksum = generateChecksum(fileContent, checksumAlgorithm);
  const createMultiPartUploadCommand = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm,
    ContentType: "video/mp4",
    ContentDisposition: `attachment; filename="${fileName}"`,
    ChecksumSHA256: checksum,
  });
  const response = await client.send(createMultiPartUploadCommand);

  console.log("AWS response: ");
  console.dir(response, { depth: null });
  console.log("My checksum: ", checksum);
})();
