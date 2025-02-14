import { ChecksumAlgorithm, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { readFile, stat } from "fs/promises";

import { S3Service } from "./s3.service";
import { generateChecksum } from "./generate-checksum";

const client = new S3Client({
  region: "eu",
  credentials: { accessKeyId: "adminadmin", secretAccessKey: "adminadmin" },
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
});
const s3StorageService = new S3Service(client);
const key = randomUUID();
const bucket = "test";

export class FileUploaderService {
  private parts: { etag: string; partNumber: number }[] = [];
  private uploadId?: string;
  private checksum?: string;
  private totalSize = 0;
  private receivedSize = 0;
  private algorithm?: ChecksumAlgorithm;

  async createMultipartUpload(
    algorithm: ChecksumAlgorithm,
    checksum: string,
    fileName: string,
    totalFileSize: number
  ): Promise<void> {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const uploadId = await s3StorageService.createMultipartUpload(
      bucket,
      key,
      algorithm,
      "application/json",
      fileName
    );

    this.uploadId = uploadId;
    this.checksum = checksum;
    this.algorithm = algorithm;
    this.totalSize = totalFileSize;
  }

  /**@returns The ETag of the uploaded part */
  async uploadPart(partNumber: number, data: Uint8Array): Promise<void> {
    if (!this.uploadId) {
      throw "uploadId is not set";
    }
    if (!this.algorithm) {
      throw "algorithm is not set";
    }

    const etag = await s3StorageService.uploadPart(
      bucket,
      key,
      this.uploadId,
      this.algorithm,
      partNumber,
      data
    );

    console.debug({ partNumber, etag });
    console.debug(
      `Received ${this.receivedSize} bytes of ${this.totalSize} bytes`
    );

    this.receivedSize += data.length;
    this.parts.push({ partNumber, etag });
  }

  async isFileCorrupted(): Promise<boolean> {
    if (!this.uploadId) {
      throw "uploadId is not set";
    }

    const etag = await s3StorageService.getEtag(bucket, key);

    return etag !== this.checksum;
  }

  /**
   * @returns
   * The ETag of the object part or maybe it will be undefined if AWS is still processing the object.
   */
  async completeMultipartUpload(): Promise<string | undefined> {
    if (!this.uploadId) {
      throw "uploadId is not set";
    }

    if (this.receivedSize !== this.totalSize) {
      throw `Received size ${this.receivedSize} does not match total size ${this.totalSize}`;
    }

    return s3StorageService.completeMultipartUpload(
      bucket,
      key,
      this.uploadId,
      this.parts
    );
  }

  async abortMultipartUpload(): Promise<void> {
    if (!this.uploadId) {
      throw "uploadId is not set";
    }

    await s3StorageService.abortMultipartUpload(bucket, key, this.uploadId);
  }
}

(async () => {
  const fileUploaderService = new FileUploaderService();
  const fileName = "pnpm-lock.yaml";
  const stream = createReadStream(fileName);
  const fileContent = await readFile(fileName, {
    encoding: "binary",
  });
  const { size: totalFileSize } = await stat(fileName);
  const checksum = generateChecksum(fileContent, ChecksumAlgorithm.SHA256);

  console.log("Checksum: ", checksum);

  await fileUploaderService.createMultipartUpload(
    ChecksumAlgorithm.SHA256,
    checksum,
    fileName,
    totalFileSize
  );

  console.log("Uploading...");

  let partNumber = 1;
  for await (const chunk of stream) {
    await fileUploaderService.uploadPart(partNumber++, chunk);
  }

  console.log("Completing...");

  await fileUploaderService.completeMultipartUpload();
})();
