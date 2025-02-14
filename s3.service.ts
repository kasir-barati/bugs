import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  GetObjectOutput,
  HeadObjectCommand,
  NoSuchKey,
  PutObjectCommand,
  PutObjectOutput,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { PutObjectCommandInput } from "@aws-sdk/client-s3/dist-types/commands/PutObjectCommand";

export class S3Service {
  constructor(private readonly s3Client: S3Client) {}

  /**
   *
   * @returns upload ID. We'll use this ID to associate all of the parts in the specific multipart upload.
   */
  async createMultipartUpload(
    bucket: string,
    key: string,
    checksumAlgorithm: ChecksumAlgorithm,
    mimetype: string,
    originalname: string
  ): Promise<string> {
    const command = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      ChecksumAlgorithm: checksumAlgorithm,
      ContentType: mimetype,
      ContentDisposition: `attachment; filename="${originalname}"`,
    });
    const response = await this.s3Client.send(command);

    if (!response.UploadId) {
      throw "UploadId is missing";
    }

    return response.UploadId;
  }

  /**@returns ETag for the uploaded part. Store them for later integrity check! */
  async uploadPart(
    bucket: string,
    key: string,
    uploadId: string,
    algorithm: ChecksumAlgorithm,
    chunkPart: number,
    data: Uint8Array
  ): Promise<string> {
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      ChecksumAlgorithm: algorithm,
      PartNumber: chunkPart,
      Body: data,
    });
    console.log();
    const response = await this.s3Client.send(command);

    if (!response.ETag) {
      throw "ETag is missing";
    }

    return response.ETag.replaceAll('"', "");
  }

  async getEtag(bucket: string, key: string): Promise<string> {
    const response = await this.s3Client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    if (!response.ETag) {
      throw "ETag is missing";
    }

    return response.ETag.replaceAll('"', "");
  }

  async completeMultipartUpload(
    bucket: string,
    key: string,
    uploadId: string,
    parts: { etag: string; partNumber: number }[]
  ): Promise<string | undefined> {
    const Parts: CompletedPart[] = parts
      .sort((a, b) => a.partNumber - b.partNumber)
      .map((part) => ({ ETag: part.etag, PartNumber: part.partNumber }));
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts },
    });

    console.debug({ Parts });
    console.debug(command);

    const response = await this.s3Client.send(command);

    if (!response.ETag) {
      throw "ETag is missing";
    }

    return response.ETag.replaceAll('"', "");
  }

  async abortMultipartUpload(bucket: string, key: string, uploadId: string) {
    const command = new AbortMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
    });

    await this.s3Client.send(command);
  }

  async getObjectByKey(bucket: string, key: string): Promise<GetObjectOutput> {
    try {
      return await this.s3Client.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
      );
    } catch (e) {
      if (e instanceof NoSuchKey) {
        console.error(`${e.name}: ${e.message} "${key}"`);
      } else {
        console.error(e);
      }
      throw `Cannot find file using key ${key}`;
    }
  }

  async objectExists(bucket: string, key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key })
      );
      return true;
    } catch {
      return false;
    }
  }

  async putObjectByKey(
    bucket: string,
    key: string,
    buffer: Buffer,
    contentType?: string,
    contentDisposition?: string
  ): Promise<PutObjectOutput> {
    const input: PutObjectCommandInput = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
    };

    if (contentDisposition) {
      input.ContentType = contentType;
    }

    if (contentDisposition) {
      input.ContentDisposition = contentDisposition;
    }

    try {
      return await this.s3Client.send(new PutObjectCommand(input));
    } catch {
      throw `cannot store file ${key} in s3 bucket ${bucket}`;
    }
  }
}
