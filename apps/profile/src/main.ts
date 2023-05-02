import {NestFactory} from '@nestjs/core';
import {ProfileModule} from './profile.module';
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {SharedService} from "@app/shared";

async function bootstrap() {
  const app = await NestFactory.create(ProfileModule);

  // // Получим доступ к переменным окружения.
  // const configService = app.get(ConfigService);
  // const USER = configService.get('RABBITMQ_USER');
  // const PASSWORD = configService.get('RABBITMQ_PASS');
  // const HOST = configService.get('RABBITMQ_HOST');
  // const QUEUE = configService.get('RABBITMQ_PROFILE_QUEUE');
  // // Используе дженерик "MicroserviceOptions".
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options:{
  //     urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
  //     //urls:[`amqp://rabbitmq:5672`],
  //     //urls: [`amqp://user:password@rabbitmq:5672`],
  //     noAck: false, // Будем подтверждать получение в ручную(в контроллере).
  //     queue: QUEUE,
  //     //queue: 'profile_queue',
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  // Перейдём на использование SharedService.
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const queue = configService.get('RABBITMQ_PROFILE_QUEUE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));

  await app.startAllMicroservices();
  //await app.listen(3000);
}
bootstrap();
