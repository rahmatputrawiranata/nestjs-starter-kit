import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME') || 'NestJS APP')
    .setVersion('1.0')
    .addTag('nestjs')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
