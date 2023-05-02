import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "@app/shared/models/users.model";
import {Role} from "@app/shared/models/roles.model";
import {TokenService} from "../../token/src/token.service";
import * as bcrypt from 'bcryptjs';
import {ConfigService} from "@nestjs/config";

// import * as configService from 'ConfigService';
// import process from "process";

@Injectable()
export class UsersService {
  constructor(
      @InjectModel(User) private userRepository: typeof User,  // Вводим модель User под именем userRepository, для работы с БД.
      @InjectModel(Role) private roleRepository: typeof Role,
      private readonly configService: ConfigService,
      private readonly tokenService: TokenService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  // Найти пользователя по емэйлу.
  async getUserByEmail(email: string) {
    const users = await this.userRepository.findOne({where:{email}, include: {all: true}});  // добавим опцию where, чтобы получать пользователя по email.
    return users;
  }

  // Найти всех юзеров.
  async getAllUsers() {
    const users = await this.userRepository.findAll({include:{all:true}});
    return users;
  }

  // На старте приложения вызовем функцию, для создания администратора:
  async createAdminUser() {
    try {
      // Проверим, существует ли роль администратора.
      const adminRole = await this.roleRepository.findOne({where: {value: 'ADMIN'}}); // Найдём роль по value 'ADMIN'.
      if (!adminRole) {
        console.log('Роль ADMIN не найдена');   // Если её вдруг не существует, выведем в консоль сообщение б этом.
        return;
      }
      // Проверим, вдруг администратор уже существует.
      const existingAdminUser = await this.userRepository.findOne({where: {Id_role: adminRole.Id_role}});
      if (existingAdminUser) {
        console.log('Существует действующий администратор');
        return;
      }
      //const configService = ConfigService;
      const adminEmail = this.configService.get('ADMIN_EMAIL');
      const adminPassword = this.configService.get('ADMIN_PASSWORD');
      //const adminEmail = process.env.ADMIN_EMAIL;          // Возьмем пароль и email из переменных окружения.
      //const adminPassword = process.env.ADMIN_PASSWORD;
      if (!adminEmail || !adminPassword) {  // Если email и пароль не были переданы в переменных окружения, выведем в консоль сообщение б этом.
        console.log('Email или пароль администратора не найдены в файле окружения');
        return;
      }
      // Захэшируем пароль администратора.
      const adminHashPassword = await bcrypt.hash(adminPassword, 5);
      //const role = await this.roleRepository.findOne({where:{Id_role: adminRole.Id_role}});
      // Создаём администратора.
      const payload = {
        email: adminEmail,
        password: adminHashPassword,
        isActivated: true,
        Id_role: adminRole.Id_role,
        roles: adminRole,
      };
      const admin = await this.userRepository.create({...payload});
      const tokens = await this.tokenService.generateTokens(payload); // Сгенерируем для администратора токены.
      await this.tokenService.save_or_refresh_refreshToken(1, tokens.refreshToken);    // Сохраним refreshToken администратора.
      console.log(`Администратор успешно создан, его accessToken: ${JSON.stringify(tokens.accessToken)}`);
      return {...tokens, admin}
    } catch (error) {
      console.error('При создании Администратора произошла ошибка:', error);
    }
  }
}
