import { freemem, totalmem } from "os";

export function memoryLogger() {
  console.log("-".repeat(50));
  console.log("| Free system memory\t\t:\t" + bytesToMb(freemem()) + " Mb |");
  console.log("-".repeat(50));
  console.log(
    "| Total amount of system memory :\t" + bytesToMb(totalmem()) + " Mb |"
  );
  console.log("-".repeat(50));
}

memoryLogger();

function bytesToMb(bytes: number) {
  return Math.ceil(bytes / (1024 * 1024));
}
