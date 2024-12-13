import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AlertService } from './alert.service';
import { Alert } from './entities/alert.entity';
import { CreateAlertInput } from './dto/create-alert.input';
import { UpdateAlertInput } from './dto/update-alert.input';

@Resolver(() => Alert)
export class AlertResolver {
  constructor(private readonly alertService: AlertService) {}

  @Mutation(() => Alert)
  createAlert(@Args('createAlertInput') createAlertInput: CreateAlertInput) {
    return this.alertService.create(createAlertInput);
  }

  @Query(() => [Alert], { name: 'findAllAlerts' })
  findAll() {
    return this.alertService.findAll();
  }

  @Query(() => Alert, { name: 'findOneAlert' })
  findOne(@Args('id') id: string) {
    return this.alertService.findOne(id);
  }

  @Mutation(() => Alert)
  updateAlert(@Args('updateAlertInput') updateAlertInput: UpdateAlertInput) {
    return this.alertService.update(updateAlertInput.id, updateAlertInput);
  }

  @Mutation(() => Alert)
  removeAlert(@Args('id') id: string) {
    return this.alertService.remove(id);
  }
}
