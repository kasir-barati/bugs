import { ChecksumAlgorithm } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { checksums } from "aws-crt";

/**
 * @description
 * Full object checksums in multipart uploads are only available for CRC-based checksums because they can linearize into a full object checksum.
 */
export function generateChecksum(
  content: string,
  algorithm: ChecksumAlgorithm
) {
  switch (algorithm) {
    case "SHA1":
    case "SHA256":
      return createHash(algorithm).update(content, "utf8").digest("base64");
    case "CRC32":
      const crc32Checksum = checksums.crc32(content);
      return Buffer.from(crc32Checksum.toString(), "utf8").toString("base64");
    case "CRC32C":
      const crc32cChecksum = checksums.crc32c(content);
      return Buffer.from(crc32cChecksum.toString(), "utf8").toString("base64");
    case "CRC64NVME":
      const crc64nvmeChecksum = checksums.crc64nvme(content);
      return Buffer.from(crc64nvmeChecksum.buffer).toString("base64");
  }
}
