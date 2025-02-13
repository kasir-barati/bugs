import { Module } from '@nestjs/common';
import { CalcGrpcController } from './calc.grpc-controller';
import { CalcService } from './calc.service';

@Module({
  controllers: [CalcGrpcController],
  providers: [CalcService],
})
export class CalcModule {}
