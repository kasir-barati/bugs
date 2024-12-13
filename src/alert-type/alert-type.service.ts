import { Injectable } from '@nestjs/common';
import { CreateAlertTypeInput } from './dto/create-alert-type.input';
import { UpdateAlertTypeInput } from './dto/update-alert-type.input';
import { InjectRepository } from '@nestjs/typeorm';
import { AlertType } from './entities/alert-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertTypeService {
  constructor(
    @InjectRepository(AlertType)
    private alertTypeRepository: Repository<AlertType>,
  ) {}

  async create(createAlertTypeInput: CreateAlertTypeInput) {
    return this.alertTypeRepository.save(createAlertTypeInput);
  }

  findAll() {
    return this.alertTypeRepository.find({
      relations: {
        alerts: true,
      },
    });
  }

  findOne(id: string) {
    return this.alertTypeRepository.findOne({ where: { id } });
  }

  update(id: string, updateAlertTypeInput: UpdateAlertTypeInput) {
    return this.alertTypeRepository.update(id, updateAlertTypeInput);
  }

  remove(id: string) {
    return this.alertTypeRepository.delete({ id });
  }
}
