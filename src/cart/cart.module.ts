import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CartController } from './cart.controller';

@Module({
  imports: [UserModule],
  controllers: [CartController],
})
export class CartModule {}
