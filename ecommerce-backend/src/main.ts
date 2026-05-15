import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Global Prefix
  app.setGlobalPrefix('api');

  // ✅ Validation (VERY IMPORTANT FOR DTO TYPES)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // 🔥 important
      },
    }),
  );

  // ✅ Security
  app.use(helmet());

  // ✅ CORS
  const allowedOrigin = process.env.CORS_ORIGIN || '*';
  const allowedOrigin2 = 'http://localhost:3001';

  app.enableCors({
    origin: [allowedOrigin, allowedOrigin2],
    credentials: true,
  });

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API documentation for Ecommerce Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 8000;

  await app.listen(port);

  console.log(`🚀 Server running on http://localhost:${port}/api`);
  console.log(`📚 Swagger running on http://localhost:${port}/docs`);
}

bootstrap();