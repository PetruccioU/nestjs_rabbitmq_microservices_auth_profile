import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './users.service';
import {PostgresDBModule} from "@app/shared/modules/postgresdb.module";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "@app/shared/models/users.model";
import {Role} from "@app/shared/models/roles.model";
import {TokenModule} from "../../token/src/token.module";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    PostgresDBModule,
    SequelizeModule.forFeature([User, Role]),
    TokenModule,
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [
    UsersService,
    ConfigService
  ],
})
export class UserModule {}
