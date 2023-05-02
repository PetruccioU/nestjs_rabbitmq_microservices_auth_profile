import { Module } from '@nestjs/common';
import process from "process";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {User} from "@app/shared/models/users.model";
import {Role} from "@app/shared/models/roles.model";
import {Token} from "@app/shared/models/token.model";
import {Profile} from "@app/shared/models/profile.model";

//import { TypeOrmModule } from '@nestjs/typeorm';
//import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'postgres',
    //     url: configService.get('POSTGRES_URI'),
    //     autoLoadEntities: true,
    //     synchronize: true, // shouldn't be used in production - may lose data
    //   }),
    //
    //   inject: [ConfigService],
    // }),

    // Добавим в список импортов Sequelize - современную ORM для работы с TypeScript и Node.js.
      SequelizeModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
              dialect: 'postgres',
              host: configService.get('POSTGRES_HOST'),
              port: configService.get('POSTGRES_PORT'),
              username: configService.get('POSTGRES_USER'),
              password: configService.get('POSTGRES_PASSWORD'),
              database: configService.get('POSTGRES_DB'),
              models: [User, Role, Token, Profile],
              autoLoadModels: true,
          }),
          inject: [ConfigService],
      }),
  ],
})
export class PostgresDBModule {}
