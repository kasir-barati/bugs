import {
  ChecksumAlgorithm,
  GetObjectAttributesCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { PassThrough } from "stream";
import { generateChecksum } from "./generate-checksum";
import { readFile, stat } from "fs/promises";
import { Upload } from "./upload/upload";

let uploadId: string | undefined;
let checksum = "";
const client = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: "adminadmin",
    secretAccessKey: "adminadmin",
  },
  // logger: console,
  // Just needed in Minio
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});
const Key = randomUUID();
const fileName = "upload-me.mp4";
const Bucket = "test";
const checksumAlgorithm = ChecksumAlgorithm.CRC32;
const chunkSize = 1024 * 1024;

function uploadMe(passThroughStream: PassThrough) {
  const upload = new Upload({
    client,
    leavePartsOnError: false,
    params: {
      Bucket,
      Body: passThroughStream,
      Key,
      ChecksumAlgorithm: checksumAlgorithm,
      ChecksumType: "FULL_OBJECT",
    },
  });

  return upload;
}

(async () => {
  const { size: fileSize } = await stat(fileName);
  const readStream = createReadStream(fileName, { highWaterMark: chunkSize });
  const fileContent = await readFile("upload-me.mp4");
  let passThroughStream = new PassThrough();
  let size = 0;

  passThroughStream = readStream.pipe(passThroughStream);

  const upload = uploadMe(passThroughStream);

  readStream
    .on("data", (chunk) => {
      size += chunk.length;

      if (size > 7000000) {
        checksum = generateChecksum(fileContent, checksumAlgorithm);
      }
    })
    .on("end", () => {
      console.log("DONE");
    });

  await upload
    .on("httpUploadProgress", console.log)
    .once("beforeCompleteMultipartUploadCommand", (params) => {
      params.ChecksumCRC32 = checksum;
    })
    .done();

  const file = await client.send(
    new GetObjectAttributesCommand({
      Bucket,
      Key,
      ObjectAttributes: ["Checksum"],
    })
  );

  console.log(checksum);
  console.dir(file.Checksum, { depth: null });
})().catch((error) => {
  console.dir(
    {
      uploadId,
      Key,
      Bucket,
      checksum,
    },
    { depth: null }
  );
  console.error(error);
});

/**

7549557
7549557
{
  loaded: 2306677,
  total: undefined,
  part: 2,
  Key: '20a040fc-1933-428c-8d2f-c81f86632eb6',
  Bucket: 'test-checksum-mjb'
}
{
  loaded: 7549557,
  total: undefined,
  part: 1,
  Key: '20a040fc-1933-428c-8d2f-c81f86632eb6',
  Bucket: 'test-checksum-mjb'
}
nB0LRA==
{ ChecksumCRC32: 'nz0A4Q==', ChecksumType: 'COMPOSITE' }
لg
 */
