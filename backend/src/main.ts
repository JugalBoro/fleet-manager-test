import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'log'], //, 'warn', 'debug', 'verbose', 'log'
  });
  console.log(port);
  await app.listen(port);
}
bootstrap();
