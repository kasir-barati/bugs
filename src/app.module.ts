import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
// import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { CalcModule } from './calc/calc.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // UserModule,
    CartModule,
    CalcModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
