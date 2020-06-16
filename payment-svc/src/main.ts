import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('bootstrap payment service');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule,{
    transport: Transport.TCP,
    options :{
      host: "127.0.0.1",
      port: 8888
    }
  });
  await app.listen(()=>logger.log(`Microservice Payment is listening`));
}
bootstrap();