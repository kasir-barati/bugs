import { Module } from '@nestjs/common';
import { AppGrpcController } from './app.grpc-controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppGrpcController],
  providers: [AppService],
})
export class AppModule {}
