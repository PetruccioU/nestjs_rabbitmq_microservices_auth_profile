import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {SharedModule} from "@app/shared";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './.env'
      }),
      SharedModule.registerRmq(
          'AUTH_SERVICE',
          process.env.RABBITMQ_AUTH_QUEUE
      ),
      SharedModule.registerRmq(
          'PROFILE_SERVICE',
          process.env.RABBITMQ_PROFILE_QUEUE,
      ),


  ],
  controllers: [AppController],
  providers: [
    AppService,



    // {
    //   // Регистрируем сервис профилей как провайдер.
    //   provide: 'PROFILE_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     const USER = configService.get('RABBITMQ_USER');
    //     const PASSWORD = configService.get('RABBITMQ_PASS');
    //     const HOST = configService.get('RABBITMQ_HOST');
    //     const QUEUE = configService.get('RABBITMQ_PROFILE_QUEUE');
    //
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options:{
    //         urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
    //         //urls: [`amqp://user:password@rabbitmq:5672`],
    //         //urls: [`amqp://rabbitmq:5672`],
    //         queue: QUEUE,
    //         queueOptions:{
    //           durable: true,
    //         },
    //       },
    //     });
    //   },
    //   inject:[ConfigService]
    // },
    // {
    //   // Регистрируем сервис auth как провайдер.
    //   provide: 'AUTH_SERVICE',
    //   useFactory: (configService: ConfigService) => {
    //     const USER = configService.get('RABBITMQ_USER');
    //     const PASSWORD = configService.get('RABBITMQ_PASS');
    //     const HOST = configService.get('RABBITMQ_HOST');
    //     const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
    //
    //     return ClientProxyFactory.create({
    //       transport: Transport.RMQ,
    //       options:{
    //         urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
    //         //urls: [`amqp://localhost:5672`],  // работает при запуске rabbitmq в контейнере, микросервиса локально.
    //         //urls: [`amqp://rabbitmq:5672`],
    //         queue: QUEUE,
    //         //queue: 'auth_queue',
    //         queueOptions:{
    //           durable: true,
    //         },
    //       },
    //     });
    //   },
    //   inject:[ConfigService]
    // },

  ],
})
export class AppModule {}
