import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log('Starting MatchVerse API...');
  console.log('Environment Variables:', {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? 'Exists' : 'Not Set',
  });

  const app = await NestFactory.create(AppModule);

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:8081',
      'https://your-frontend.azurewebsites.net',
    ],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Swagger config
  const config = new DocumentBuilder()
    .setTitle('MatchVerse API')
    .setDescription('API documentation for the MatchVerse backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📚 Swagger Docs available at http://localhost:${port}/api`);
}

bootstrap();
