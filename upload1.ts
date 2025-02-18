import { Upload } from "@aws-sdk/lib-storage";
import {
  ChecksumAlgorithm,
  CreateMultipartUploadCommandInput,
  GetObjectAttributesCommand,
  S3Client,
  UploadPartCommandInput,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { PassThrough } from "stream";
import { readFile } from "fs/promises";
import { generateChecksum } from "./generate-checksum";

let uploadId: string | undefined;
let checksum: string | undefined;
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

client.middlewareStack.use({
  applyToStack: (stack) => {
    stack.add(
      (next) => async (args) => {
        const checksumAlgorithm = (
          args.input as CreateMultipartUploadCommandInput
        )?.ChecksumAlgorithm;

        if ("PartNumber" in args.input) {
          delete (args.input as UploadPartCommandInput).ChecksumAlgorithm;
          delete (args.input as any)["Checksum" + checksumAlgorithm];
        }
        (args.input as CreateMultipartUploadCommandInput).ChecksumType =
          "FULL_OBJECT";

        return next(args);
      },
      { step: "initialize" }
    );
  },
});

async function uploadMe(passThroughStream: PassThrough) {
  const fileContent = await readFile(fileName);
  checksum = generateChecksum(fileContent, checksumAlgorithm);

  try {
    const upload = new Upload({
      client,
      leavePartsOnError: false,
      params: {
        Bucket,
        Body: passThroughStream,
        Key,
        ChecksumAlgorithm: checksumAlgorithm,
        ChecksumCRC32: checksum,
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
  const chunkSize = 1024;
  const readStream = createReadStream(fileName, { highWaterMark: chunkSize });
  let passThroughStream = new PassThrough();

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
