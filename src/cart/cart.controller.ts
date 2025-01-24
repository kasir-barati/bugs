import { Controller, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('cart')
export class CartController {
  constructor(private userService: UserService) {}

  @Get()
  async getHello() {
    await this.userService.test();

    return 'Hi';
  }
}
