const fs = require("fs");
const path = require("path");

export function generateLargeFile(fileName: string, sizeInMb: number) {
  return new Promise<void>((resolve, reject) => {
    const targetSizeBytes = sizeInMb * 1024 * 1024;
    const chunk = "abcdefghijklmnopqrstuvwxyz0123456789\n";
    const chunkSize = Buffer.byteLength(chunk);
    const stream = fs.createWriteStream(fileName, { flags: "w" });
    let bytesWritten = 0;

    function writeChunk() {
      while (bytesWritten < targetSizeBytes) {
        let remaining = targetSizeBytes - bytesWritten;
        let thisChunk = chunk;
        if (remaining < chunkSize) {
          thisChunk = chunk.slice(0, remaining);
        }
        const ok = stream.write(thisChunk);
        bytesWritten += Buffer.byteLength(thisChunk);
        if (!ok) {
          stream.once("drain", writeChunk);
          return;
        }
      }
      stream.end();
    }

    stream.on("finish", () => {
      console.log(`${fileName} generated with size: ${bytesWritten} bytes`);
      resolve();
    });
    stream.on("error", reject);

    // Start writing
    writeChunk();
  });
}
