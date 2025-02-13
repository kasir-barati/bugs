import { Test, TestingModule } from '@nestjs/testing';
import { CalcGrpcController } from './calc.grpc-controller';

describe('CalcController', () => {
  let controller: CalcGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalcGrpcController],
    }).compile();

    controller = module.get<CalcGrpcController>(CalcGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
