import { Injectable } from '@nestjs/common';
import { CreateAlertInput } from './dto/create-alert.input';
import { UpdateAlertInput } from './dto/update-alert.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  create(createAlertInput: CreateAlertInput) {
    return this.alertRepository.save({
      userId: 'dcb9e829-522e-4206-81d7-d168502b3503',
      ...createAlertInput,
    });
  }

  findAll() {
    return this.alertRepository.find({
      relations: {
        alertType: true,
      },
    });
  }

  findOne(id: string) {
    return this.alertRepository.findOne({ where: { id } });
  }

  update(id: string, updateAlertInput: UpdateAlertInput) {
    return this.alertRepository.update({ id }, updateAlertInput);
  }

  remove(id: string) {
    return this.alertRepository.delete({ id });
  }
}
