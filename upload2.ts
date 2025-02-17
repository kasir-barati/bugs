import { Upload } from "@aws-sdk/lib-storage";
import {
  ChecksumAlgorithm,
  GetObjectAttributesCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { PassThrough } from "stream";
import { generateChecksum } from "./generate-checksum";

let uploadId: string | undefined;
let checksum = "";
const client = new S3Client({
  region: "eu",
  credentials: {
    accessKeyId: "key",
    secretAccessKey: "secret",
  },
  // logger: console,
});
const Key = randomUUID();
const fileName = "upload-me.mp4";
const Bucket = "test-checksum-mjb";
const checksumAlgorithm = ChecksumAlgorithm.CRC32;
const chunkSize = 1024 * 1024;

async function uploadMe(passThroughStream: PassThrough) {
  try {
    const upload = new Upload({
      client,
      leavePartsOnError: false,
      params: {
        Bucket,
        Body: passThroughStream,
        Key,
        ChecksumAlgorithm: checksumAlgorithm,
      },
    });

    upload.on("httpUploadProgress", console.log);

    uploadId = upload.uploadId;

    await upload.done();
  } catch (e) {
    console.log(e);
  }
}

(async () => {
  const readStream = createReadStream(fileName, { highWaterMark: chunkSize });
  let passThroughStream = new PassThrough();
  let size = 0;

  readStream
    .on("data", (chunk) => {
      size += chunkSize;

      if (is5Mb(size)) {
        checksum += generateChecksum(chunk, checksumAlgorithm);
      }
    })
    .on("end", () => {
      checksum = generateChecksum(checksum, checksumAlgorithm);
    });

  passThroughStream = readStream.pipe(passThroughStream);

  await uploadMe(passThroughStream);

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

function is5Mb(size: number) {
  return size === chunkSize * 5;
}
