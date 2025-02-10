import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AudioConsumer } from './audio.consumer';
import { UserController } from './user.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  providers: [UserService, AudioConsumer],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
