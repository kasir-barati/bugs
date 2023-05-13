import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ContactUsModule } from '../modules/contact-us/contact-us.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import corsConfig from './configs/cors.config';
import helmetConfig from './configs/helmet.config';
import { MongooseModuleConfig } from './configs/mongoose.config';
import webAppConfig from './configs/web-app.config';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule.forFeature(webAppConfig)],
            useClass: MongooseModuleConfig,
        }),
        ConfigModule.forRoot({
            envFilePath: [join(process.cwd(), '..', '..', '.env')],
            load: [webAppConfig, corsConfig, helmetConfig],
            cache: true,
        }),
        ContactUsModule,
    ],
    controllers: [AppController],
    providers: [AppService, Logger],
})
export class AppModule {}
