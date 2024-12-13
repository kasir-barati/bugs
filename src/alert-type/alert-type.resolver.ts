import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AlertTypeService } from './alert-type.service';
import { AlertType } from './entities/alert-type.entity';
import { CreateAlertTypeInput } from './dto/create-alert-type.input';
import { UpdateAlertTypeInput } from './dto/update-alert-type.input';
import { Alert } from 'src/alert/entities/alert.entity';

@Resolver(() => AlertType)
export class AlertTypeResolver {
  constructor(private readonly alertTypeService: AlertTypeService) {}

  @Mutation(() => AlertType)
  createAlertType(
    @Args('createAlertTypeInput') createAlertTypeInput: CreateAlertTypeInput,
  ) {
    return this.alertTypeService.create(createAlertTypeInput);
  }

  @Query(() => [AlertType], { name: 'findAllAlertTypes' })
  findAll() {
    return this.alertTypeService.findAll();
  }

  @Query(() => AlertType, { name: 'findOneAlertType' })
  findOne(@Args('id') id: string) {
    return this.alertTypeService.findOne(id);
  }

  @Mutation(() => AlertType)
  updateAlertType(
    @Args('updateAlertTypeInput') updateAlertTypeInput: UpdateAlertTypeInput,
  ) {
    return this.alertTypeService.update(
      updateAlertTypeInput.id,
      updateAlertTypeInput,
    );
  }

  @Mutation(() => AlertType)
  removeAlertType(@Args('id') id: string) {
    return this.alertTypeService.remove(id);
  }
}
