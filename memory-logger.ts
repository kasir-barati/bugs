import { freemem, totalmem } from "os";

export function memoryLogger() {
  console.log("Free system memory: " + bytesToMb(freemem()) + " Mb");
  console.log(
    "Total amount of system memory: " + bytesToMb(totalmem()) + " Mb"
  );
}

function bytesToMb(bytes: number) {
  return bytes / (1024 * 1024);
}
