import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false, timestamps: false })
export class Address {
  @Prop()
  street: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  name: string;

  @Prop(AddressSchema)
  address: Address;
}
export const UserSchema = SchemaFactory.createForClass(User);
