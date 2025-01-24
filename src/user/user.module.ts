import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AudioConsumer } from './audio.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
    }),
  ],
  providers: [UserService, AudioConsumer],
  exports: [UserService],
})
export class UserModule {}
