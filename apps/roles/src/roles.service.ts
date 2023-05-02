import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "@app/shared/models/roles.model";

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role)
  {}

  // Метод для создания роли администратора
  async createAdminRoleInitial() {
    try {
      const isAdminRole = await this.getRoleByValue('ADMIN');  // Проверим, вдруг роль администратора уже существует.
      if (!isAdminRole) {
        await this.roleRepository.create({   // Если нет, создадим его.
          value: 'ADMIN',
          description: 'Administrator role',
        });
        console.log('Изначальная роль: ADMIN создана');
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Метод для создания роли пользователя
  async createUserRoleInitial() {
    try {
      const isUserRole = await this.getRoleByValue('USER');
      if (!isUserRole) {
        await this.roleRepository.create({
          value: 'USER',
          description: 'Regular user role',
        });
        console.log('Изначальная роль: USER создана');
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getRoleByValue(value: string){  // Создадим асинхронную функцию для поиска ролей по значению, как метод класса RolesService.
    return await this.roleRepository.findOne({where: {value}});   // Используем метод .findOne, из ORM sequelize.
  }
}
