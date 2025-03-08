import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AudioConsumer } from './audio.consumer';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BullModule.registerQueue({ name: 'audio' }),
  ],
  providers: [UserService, AudioConsumer],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
