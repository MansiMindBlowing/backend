import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
   console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'LOADED ✓' : 'MISSING ✗');
  console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'LOADED ✓' : 'MISSING ✗');
   console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
  console.log('GOOGLE_CLIENT_ID loaded:', !!process.env.GOOGLE_CLIENT_ID);
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
