import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Blocks Project API')
        .setDescription('API documentation for Blocks Project')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
    console.log(`Application is running on: http://localhost:${3000}`);
    console.log(
        `Swagger documentation available at: http://localhost:${3000}/api`,
    );
}

bootstrap();
