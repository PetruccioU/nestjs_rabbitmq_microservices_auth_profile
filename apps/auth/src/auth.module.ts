import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SharedModule} from "@app/shared";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "@app/shared/models/users.model";
import {Role} from "@app/shared/models/roles.model";
import {TokenModule} from "../../token/src/token.module";
import {RolesModule} from "../../roles/src/roles.module";
import {UserModule} from "../../user/src/user.module";
import {PostgresDBModule} from "@app/shared/modules/postgresdb.module";

import {RolesService} from "../../roles/src/roles.service";
import {TokenService} from "../../token/src/token.service";
import {Profile} from "@app/shared/models/profile.model";
import {Token} from "@app/shared/models/token.model";
import process from "process";
import {UsersService} from "../../user/src/users.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    //SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([
      Role,
      User
        ]),
    TokenModule,
    RolesModule,
    UserModule,
    SharedModule.registerRmq(
        'PROFILE_SERVICE',
        //process.env.RABBITMQ_PROFILE_QUEUE,
        'profile_queue'
    ),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    //RolesService,
    //TokenService,
  ],
})
export class AuthModule {}


// SequelizeModule.forRoot({
//   dialect: 'postgres',
//   host: process.env.POSTGRES_HOST,
//   port: +process.env.POSTGRES_PORT,
//   username: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   database: process.env.POSTGRES_DB,
//   models: [User, Role, Token],
//   autoLoadModels: true,
// }),