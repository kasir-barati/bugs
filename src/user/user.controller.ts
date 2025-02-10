import { Controller, UseFilters, ValidationPipe } from '@nestjs/common';
import {
  Hero,
  HeroById,
  HeroesServiceController,
  HeroesServiceControllerMethods,
} from '../proto/interfaces/test.interface';
import { Observable } from 'rxjs';
import { IsUUID } from 'class-validator';
import { Ctx, Payload } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { HttpExceptionFilter } from '../http.exception';

class HeroByIdDto implements HeroById {
  @IsUUID()
  id: string;
}

@Controller()
@HeroesServiceControllerMethods()
export class UserController implements HeroesServiceController {
  @UseFilters(HttpExceptionFilter)
  findOne(
    @Payload(ValidationPipe) request: HeroByIdDto,
    @Ctx() metadata: Metadata,
  ): Promise<Hero> | Observable<Hero> | Hero {
    console.log(metadata.toJSON());
    return { id: request.id, name: 'somename' };
  }
}
