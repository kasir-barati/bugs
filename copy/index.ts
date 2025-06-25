import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
const Bucket = "test";
/** Just use `pnpx ts-node upload1.ts` and then copy the object key which is a UUID here. */
const key = "";
const path = key;
const newPath = `another${key}`;

void (async () => {
  // Note, this command will override if an object with the specified name already exists!
  const command = new CopyObjectCommand({
    Bucket,
    CopySource: `${Bucket}/${path}`,
    Key: newPath,
  });

  await client.send(command);
})();
