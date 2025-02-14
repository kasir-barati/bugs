import { ChecksumAlgorithm } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { checksums } from "aws-crt";

/**
 * @todo
 * Implement the SHA1, SHA256, and CRC32CNVME.
 *
 * @description
 * Full object checksums in multipart uploads are only available for CRC-based checksums because they can linearize into a full object checksum.
 */
export function generateChecksum(
  content: string | Buffer,
  algorithm: ChecksumAlgorithm
) {
  switch (algorithm) {
    case "CRC32": {
      const checksumNumber = checksums.crc32(content);
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32BE(checksumNumber, 0);
      return buffer.toString("base64");
    }
    case "CRC32C": {
      const crc32cChecksum = checksums.crc32c(content);
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32BE(crc32cChecksum, 0);
      return buffer.toString("base64");
    }
    default:
      throw "Not implemented!";
  }
}
