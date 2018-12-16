import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
