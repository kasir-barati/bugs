import { Crc32c } from "@aws-crypto/crc32c";
import CRC32 from "crc-32";
import { ChecksumAlgorithm } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

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
      return createHash(algorithm).update(content, "utf8").digest("hex");
    case "CRC32":
      return CRC32.buf(Buffer.from(content, "binary"), 0).toString();
    case "CRC32C":
      return new Crc32c()
        .update(Uint8Array.from(Buffer.from(content)))
        .digest()
        .toString();
    default:
      throw "Unsupported algorithm";
  }
}
