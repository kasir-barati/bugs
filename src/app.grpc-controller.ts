import { Controller, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {
  FileUploadServiceControllerMethods,
  UploadResponse,
} from './file-upload.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { ChunkDto } from './chunk.dto';
import { GrpcStreamMethod, Payload } from '@nestjs/microservices';
import { CurrentUser } from './current-user.decorator';
import { User } from './app.type';
import { AuthGuard } from './auth.guard';

@Controller()
@FileUploadServiceControllerMethods()
@UseGuards(AuthGuard)
export class AppGrpcController {
  constructor(private readonly appService: AppService) {}

  // FIXME: this does not work without having GrpcStreamMethod decorator, but why?
  @GrpcStreamMethod()
  upload(
    @Payload() dto: Observable<ChunkDto>,
    @CurrentUser() user: User,
  ): Observable<UploadResponse> {
    console.log(`Hi, ${user?.id} is in controller`);
    const subject = new ReplaySubject<UploadResponse>(1);
    this.appService.upload(subject, dto);
    return subject.asObservable();
  }
}
