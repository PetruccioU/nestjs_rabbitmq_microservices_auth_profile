import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SharedModule} from "@app/shared";
import {SequelizeModule} from "@nestjs/sequelize";
import {Profile} from "@app/shared/models/profile.model";
import {User} from "@app/shared/models/users.model";
import {Role} from "@app/shared/models/roles.model";
import {Token} from "@app/shared/models/token.model";
import {PostgresDBModule} from "@app/shared/modules/postgresdb.module";
//import {Role} from "@app/shared/models/roles.model";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    SharedModule,
    PostgresDBModule,
    // SequelizeModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     dialect: 'postgres',
    //     host: configService.get('POSTGRES_HOST'),
    //     port: configService.get('POSTGRES_PORT'),
    //     username: configService.get('POSTGRES_USER'),
    //     password: configService.get('POSTGRES_PASSWORD'),
    //     database: configService.get('POSTGRES_DB'),
    //     models: [Profile, User, Role, Token],
    //     autoLoadModels: true,
    //   }),
    //   inject: [ConfigService],
    // }),
    SequelizeModule.forFeature([Profile]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
