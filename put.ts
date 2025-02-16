import { readFile } from "fs/promises";
import {
  ChecksumAlgorithm,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { generateChecksum } from "./generate-checksum";

const bucket = "test-checksum-mjb";
const key = randomUUID();
const fileName = "upload-me.mp4";
const checksumAlgorithm = ChecksumAlgorithm.SHA256;
const client = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: "aws",
    secretAccessKey: "aws",
  },
  // endpoint: "http://localhost:9000",
  // forcePathStyle: true,
  logger: console,
});
const logRequestMiddleware =
  (next: any, _context: any) => async (args: any) => {
    console.log("Request:", args.request);

    return next(args);
  };

client.middlewareStack.add(logRequestMiddleware, { step: "finalizeRequest" });

(async () => {
  const fileContent = await readFile(fileName);
  const checksum = generateChecksum(fileContent, checksumAlgorithm);
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ChecksumAlgorithm: checksumAlgorithm,
    ContentType: "video/mp4",
    ContentDisposition: `attachment; filename="${fileName}"`,
    ChecksumSHA256: checksum,
  });
  const response = await client.send(command);

  console.log("AWS response: ");
  console.dir(response, { depth: null });
  console.log("My checksum: ", checksum);
})();
