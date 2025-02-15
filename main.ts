import { ChecksumAlgorithm, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { createReadStream } from "fs";
import { readFile, stat } from "fs/promises";
import mime from "mime-types";

import { generateChecksum } from "./generate-checksum";
import { S3Service } from "./s3.service";

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
    const mimetype = mime.lookup(fileName);

    if (!mimetype) {
      throw "Invalid mimetype";
    }

    const uploadId = await s3StorageService.createMultipartUpload(
      bucket,
      key,
      algorithm,
      mimetype,
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
    if (!this.checksum) {
      throw "checksum is not set";
    }

    const result = await s3StorageService.uploadPart(
      bucket,
      key,
      this.uploadId,
      this.algorithm,
      partNumber,
      data
    );

    console.debug(
      `Received ${this.receivedSize} bytes of ${this.totalSize} bytes`
    );

    if (!result.ETag) {
      throw "ETag is missing";
    }

    const partChecksum = {
      ...(result.ChecksumCRC32 && {
        ChecksumCRC32: result.ChecksumCRC32,
      }),
      ...(result.ChecksumCRC32C && {
        ChecksumCRC32C: result.ChecksumCRC32C,
      }),
    };

    this.receivedSize += data.length;
    this.parts.push({
      partNumber,
      etag: result.ETag?.replaceAll('"', ""),
      ...partChecksum,
    });
  }

  /**
   * @returns
   * The ETag of the object part or maybe it will be undefined if AWS is still processing the object.
   */
  async completeMultipartUpload() {
    if (!this.uploadId || !this.algorithm || !this.checksum) {
      const missingProperty = !this.uploadId
        ? "uploadId"
        : !this.checksum
        ? "checksum"
        : "algorithm";

      throw missingProperty + "is not set";
    }

    if (this.receivedSize !== this.totalSize) {
      throw `Received size ${this.receivedSize} does not match total size ${this.totalSize}`;
    }

    const etag = await s3StorageService.completeMultipartUpload(
      bucket,
      key,
      this.uploadId,
      this.checksum,
      this.algorithm,
      this.parts
    );

    console.log("Final ETAG: ", etag);
    console.log("CHECKSUM: ", this.checksum);
    console.log("PARTS: ", this.parts);
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
  const fileName = "upload-me.mp4";
  const bufferSizeInByte = 5 * 1024 * 1024; // 5MB (AWS minimum part size)
  const stream = createReadStream(fileName, {
    highWaterMark: bufferSizeInByte,
  });
  const fileContent = await readFile(fileName, {
    encoding: "binary",
  });
  const checksum = generateChecksum(fileContent, ChecksumAlgorithm.CRC32);
  const { size: totalFileSize } = await stat(fileName);

  console.log("Initiating...");

  await fileUploaderService.createMultipartUpload(
    ChecksumAlgorithm.CRC32,
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
