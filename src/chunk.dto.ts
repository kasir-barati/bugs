import { IsOptional, IsString } from 'class-validator';
import { Chunk } from './file-upload.interface';

export class ChunkDto implements Chunk {
  @IsString()
  @IsOptional()
  filename?: string;

  data: Uint8Array<ArrayBufferLike>;
}
