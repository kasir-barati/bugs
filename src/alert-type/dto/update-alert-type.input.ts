import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateAlertTypeInput } from './create-alert-type.input';

@InputType()
export class UpdateAlertTypeInput extends PartialType(CreateAlertTypeInput) {
  @Field(() => ID)
  id: string;
}
