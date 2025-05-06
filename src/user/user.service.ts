import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectQueue('audio') private audioQueue: Queue,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async onModuleInit() {
    console.log('onModuleInit');

    const user = await this.userModel.create({
      address: { street: 'test' },
    });

    console.log(user.toJSON());
  }

  async test() {
    await this.audioQueue.add('transcode', {
      foo: 'bar',
    });
  }
}
