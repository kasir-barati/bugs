import { Module } from '@nestjs/common';
import { CalcModule } from './calc/calc.module';

@Module({
  imports: [
    // BullModule.forRoot({
    //   connection: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    // UserModule,
    // CartModule,
    CalcModule,
  ],
})
export class AppModule {}
