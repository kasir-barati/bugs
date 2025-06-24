import { Module } from '@nestjs/common';
import { AppGrpcController } from './app.grpc-controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppGrpcController],
  providers: [AppService],
})
export class AppModule {}
