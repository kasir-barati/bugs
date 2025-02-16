import {
  AbortMultipartUploadCommand,
  ChecksumAlgorithm,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";

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
      ChecksumType: "FULL_OBJECT",
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
  ) {
    const command = new UploadPartCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      ChecksumAlgorithm: algorithm,
      PartNumber: chunkPart,
      Body: data,
    });
    const response = await this.s3Client.send(command);

    return response;
  }

  /**
   * @description
   * If the passed checksum does not match the one computed in AWS S3 it will fail it.
   *
   * After you initiate a multipart upload and upload one or more parts, you must either complete or stop the multipart upload to stop incurring charges for storage of the uploaded parts.
   */
  async completeMultipartUpload(
    bucket: string,
    key: string,
    uploadId: string,
    checksum: string,
    algorithm: ChecksumAlgorithm,
    parts: { etag: string; partNumber: number }[]
  ): Promise<string | undefined> {
    const Parts: CompletedPart[] = parts
      .sort((a, b) => a.partNumber - b.partNumber)
      .map(({ etag, partNumber, ...rest }) => ({
        ...rest,
        ETag: etag,
        PartNumber: partNumber,
      }));
    const command = new CompleteMultipartUploadCommand({
      Bucket: bucket,
      Key: key,
      UploadId: uploadId,
      ChecksumType: "FULL_OBJECT",
      ...(algorithm === "SHA1" && { ChecksumSHA1: checksum }),
      ...(algorithm === "SHA256" && { ChecksumSHA256: checksum }),
      ...(algorithm === "CRC32" && { ChecksumCRC32: checksum }),
      ...(algorithm === "CRC32C" && { ChecksumCRC32C: checksum }),
      ...(algorithm === "CRC64NVME" && { ChecksumCRC64NVME: checksum }),
      MultipartUpload: { Parts },
    });
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
}
