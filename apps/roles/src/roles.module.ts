import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Role} from "@app/shared/models/roles.model";
import {User} from "@app/shared/models/users.model";
import {Profile} from "@app/shared/models/profile.model";
import {PostgresDBModule} from "@app/shared/modules/postgresdb.module";

@Module({
  imports: [
    // SequelizeModule.forRoot({
    //   dialect: 'postgres',
    //   host: process.env.POSTGRES_HOST,
    //   port: +process.env.POSTGRES_PORT,
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    //   models: [Role, User],
    //   autoLoadModels: true,
    // }),
    PostgresDBModule,
    SequelizeModule.forFeature([Role])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
