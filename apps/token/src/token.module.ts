import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Token} from "@app/shared/models/token.model";
import {User} from "@app/shared/models/users.model";
import {PostgresDBModule} from "@app/shared/modules/postgresdb.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
//import {Role} from "@app/shared/models/roles.model";

@Module({
  imports: [
    PostgresDBModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: +process.env.POSTGRES_PORT,
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    //   models: [Token, User],
    //   autoLoadModels: true,
    // }),
    SequelizeModule.forFeature([Token, User])],
  controllers: [TokenController],
  providers: [
    TokenService,
    ConfigService,
  ],
  exports: [TokenService]
})
export class TokenModule {}
