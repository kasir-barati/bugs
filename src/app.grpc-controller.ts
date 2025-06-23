import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import {
  FileUploadServiceControllerMethods,
  UploadResponse,
} from './file-upload.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { ChunkDto } from './chunk.dto';
import { GrpcStreamMethod, Payload } from '@nestjs/microservices';

@Controller()
@FileUploadServiceControllerMethods()
export class AppGrpcController {
  private readonly logger = new Logger(AppGrpcController.name);

  constructor(private readonly appService: AppService) {}

  // FIXME: this does not work without having GrpcStreamMethod decorator, but why?
  // upload(@Payload() dto: Observable<ChunkDto>): Observable<UploadResponse> {
  //   this.logger.log("Hi, I'm in controller");
  //   const subject = new ReplaySubject<UploadResponse>(1);
  //   this.appService.upload(subject, dto);
  //   return subject.asObservable();
  // }

  @GrpcStreamMethod()
  upload(@Payload() dto: Observable<ChunkDto>): Observable<UploadResponse> {
    this.logger.log("Hi, I'm in controller");
    const subject = new ReplaySubject<UploadResponse>(1);
    this.appService.upload(subject, dto);
    return subject.asObservable();
  }
}
