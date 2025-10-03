import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown properties
      transform: true, // Transform payload to DTO instance
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
