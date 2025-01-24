import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  async test() {
    await this.audioQueue.add('transcode', {
      foo: 'bar',
    });
  }
}
