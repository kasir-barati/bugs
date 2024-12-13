import { Module } from '@nestjs/common';
import { AlertTypeService } from './alert-type.service';
import { AlertTypeResolver } from './alert-type.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertType } from './entities/alert-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertType])],
  providers: [AlertTypeResolver, AlertTypeService],
})
export class AlertTypeModule {}
