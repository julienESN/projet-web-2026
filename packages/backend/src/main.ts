import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodFilter } from './common/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins for dev simplicity, or specify ['http://localhost:5173', 'http://localhost:4173']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalFilters(new ZodFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
