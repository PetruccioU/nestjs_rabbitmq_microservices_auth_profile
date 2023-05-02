import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {ConfigService} from "@nestjs/config";
import {SharedService} from "@app/shared";
import {RolesService} from "../../roles/src/roles.service";
import {UsersService} from "../../user/src/users.service";

import {ProfileModule} from "../../profile/src/profile.module";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import { SequelizeModule } from '@nestjs/sequelize';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  // Создадим изначальные роли и администратора, сервисы ролей и пользователей.
  const rolesService = app.get(RolesService);
  const userService = app.get(UsersService);

  async function initial() {
    await Promise.all([
      rolesService.createUserRoleInitial(),
      rolesService.createAdminRoleInitial(),
    ]);
    await userService.createAdminUser();
  }
  await initial();

  // Перейдём на приём сообщений из очереди 'RABBITMQ_AUTH_QUEUE' используя SharedService.
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const queue = configService.get('RABBITMQ_AUTH_QUEUE');
  app.connectMicroservice(sharedService.getRmqOptions(queue));

  await app.startAllMicroservices();
}
bootstrap();

// // Получим доступ к переменным окружения.
// const configService = app.get(ConfigService);
// const USER = configService.get('RABBITMQ_DEFAULT_USER');
// const PASSWORD = configService.get('RABBITMQ_DEFAULT_PASS');
// const HOST = configService.get('RABBITMQ_HOST');
// const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
// // amqp://rabbitmq это в случае если оба сервиса в контейнере.
// // И localhost вместо рэббит в случае если сервис который
// // подключается не в контейнере.
// app.connectMicroservice<MicroserviceOptions>({
//   transport: Transport.RMQ,
//   options:{
//     urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],  // HOST = localhost:5672
//     //urls: [`amqp://rabbitmq:5672`],
//     //urls: [`amqp://localhost:5672`], // работает при запуске rabbitmq в контейнере, микросервиса локально.
//
//     noAck: false, // Будем подтверждать получение в ручную(в контроллере).
//     queue: QUEUE,
//     //queue: 'auth_queue',
//     queueOptions: {
//       durable: true,
//     },
//   },
// });
