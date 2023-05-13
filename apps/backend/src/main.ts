import { Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { json } from 'express';
import expressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import corsConfig from './app/configs/cors.config';
import helmetConfig from './app/configs/helmet.config';
import webAppConfig from './app/configs/web-app.config';

export const BACKEND_API_PREFIX = 'api/v1';

async function bootstrap() {
    let swaggerUrl: string | undefined;
    const app = await NestFactory.create(AppModule);
    const logger = app.get(Logger);

    app.setGlobalPrefix(BACKEND_API_PREFIX);
    app.use(json({ limit: '20mb' }));

    const webAppConfigs = app.get<ConfigType<typeof webAppConfig>>(
        webAppConfig.KEY,
    );
    const corsConfigs = app.get<ConfigType<typeof corsConfig>>(
        corsConfig.KEY,
    );
    const helmetConfigs = app.get<ConfigType<typeof helmetConfig>>(
        helmetConfig.KEY,
    );

    app.use(cookieParser());
    app.enableCors(corsConfigs);
    app.use(helmet(helmetConfigs));
    app.use(expressMongoSanitize());

    if (process.env.SWAGGER_PATH) {
        // initialize Swagger using the SwaggerModule class
        const documentBuilderConfig = new DocumentBuilder()
            .setTitle('You-Say API')
            .setDescription('The You-Say RESTful API')
            .setVersion('1.0')
            .addTag('')
            .addBearerAuth({
                // TODO: bearer token from keycloak
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            })
            .build();
        const swaggerDocument = SwaggerModule.createDocument(
            app,
            documentBuilderConfig,
        );

        SwaggerModule.setup(
            webAppConfigs.swaggerPath,
            app,
            swaggerDocument,
        );
        swaggerUrl = `${webAppConfigs.host}:${webAppConfigs.exposedPort}${webAppConfigs.swaggerPath}`;
    }

    await app.listen(webAppConfigs.port);
    logger.log(
        `See Swagger or App on: ${
            swaggerUrl ||
            `${webAppConfigs.host}:${webAppConfigs.exposedPort}`
        }`,
        NestApplication.name,
    );
}
bootstrap();
