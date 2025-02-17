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
import { stat } from "fs/promises";

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
  const { size: fileSize } = await stat(fileName);
  const readStream = createReadStream(fileName, { highWaterMark: chunkSize });
  let passThroughStream = new PassThrough();
  let size = 0;

  console.log(fileSize);

  readStream
    .on("data", (chunk) => {
      size += chunk.length;

      if (size === 7549557 || size === 2306677) {
        console.log(size);
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
