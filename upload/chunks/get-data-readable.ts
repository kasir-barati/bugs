import { Readable } from "stream";

export async function* getDataReadable(
  data: Readable
): AsyncGenerator<Uint8Array> {
  for await (const chunk of data) {
    if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
      yield chunk;
    } else {
      yield Buffer.from(chunk);
    }
  }
}
