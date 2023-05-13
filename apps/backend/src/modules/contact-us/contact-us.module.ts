import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUsController } from './contact-us.controller';
import { ContactUs, ContactUsSchema } from './contact-us.entity';
import { ContactUsService } from './contact-us.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: ContactUs.name,
                schema: ContactUsSchema,
            },
        ]),
    ],
    controllers: [ContactUsController],
    providers: [ContactUsService],
})
export class ContactUsModule {}
