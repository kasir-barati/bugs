import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Observable, ReplaySubject } from 'rxjs';
import { ChunkDto } from './chunk.dto';
import { UploadResponse } from './file-upload.interface';
import { validateIncomingData } from './validate-request.util';
import { PassThrough } from 'stream';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  upload(
    subject: ReplaySubject<UploadResponse>,
    dto: Observable<ChunkDto>,
  ): void {
    this.logger.log("Hi, I'm in service");

    const stream = new PassThrough();

    subject.next({});

    stream.on('error', (error) => {
      this.logger.error(
        `Something went wrong with our PassThrough stream! ${String(error)}`,
      );
      subject.error(
        new InternalServerErrorException(`Something went wrong ${error.name}`),
      );
    });

    dto.pipe().subscribe({
      next: (data) => {
        const validatedData = validateIncomingData(data);

        this.logger.log(
          `Here is the validated data ${JSON.stringify(validatedData)}`,
        );
        subject.next({});
      },
      complete: () => {
        this.logger.log('Backend received the "end" signal!');

        subject.complete();
      },
      error: (error) => {
        this.logger.error(
          `Something went wrong with our gRPC stream! ${String(error)}`,
        );
        stream.destroy();
        subject.error(error);
      },
    });
  }
}
