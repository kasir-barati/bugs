import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
import { CalcModule } from './calc/calc.module';
// import { FileUploaderModule } from './file-uploader/file-uploader.module';

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
    // FileUploaderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
