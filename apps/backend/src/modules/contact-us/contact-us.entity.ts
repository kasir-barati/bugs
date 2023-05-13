import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isEmail } from 'class-validator';

@Schema({
    timestamps: {
        createdAt: true,
        updatedAt: true,
    },
    autoIndex: true,
    validateBeforeSave: true,
    strict: true,
    selectPopulatedPaths: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class ContactUs {
    id: string;

    @Prop({ maxlength: 320, required: true })
    name: string;

    @Prop({
        required: true,
        validate: {
            validator: (value: string) => {
                return isEmail(value);
            },
            message: 'Please enter a valid email',
        },
    })
    email: string;

    @Prop({
        required: true,
        maxlength: 2000,
    })
    message: string;
}
export const ContactUsSchema =
    SchemaFactory.createForClass(ContactUs);
