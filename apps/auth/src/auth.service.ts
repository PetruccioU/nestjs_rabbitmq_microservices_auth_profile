import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Role} from "@app/shared/models/roles.model";
import {User} from "@app/shared/models/users.model";
import {RolesService} from "../../roles/src/roles.service";
import {TokenService} from "../../token/src/token.service";
import {CreateUserDto} from "../../user/src/dto/create-user.dto";
import {UpdateProfileDto} from "../../profile/src/dto/update-profile.dto";
import {ClientProxy} from "@nestjs/microservices";
import * as bcrypt from 'bcryptjs';
import {UsersService} from "../../user/src/users.service";

import {Profile} from "@app/shared/models/profile.model";
import process from "process";

@Injectable()
export class AuthService {
  constructor(
              @Inject('PROFILE_SERVICE') private profileService: ClientProxy,
              @InjectModel(Role) private roleRepository: typeof Role, // Введём модель Role
              @InjectModel(User) private userRepository: typeof User,  // Введём модель User
              private roleService: RolesService,        // Введём сервис ролей
              private tokenService: TokenService,        // Введём сервис токенов
              private userService: UsersService,
  ) {}

  // Регистрация.
  async registration(userDto, profileDto) {
    console.log('dto is in the auth service')
    const condidate = await this.userRepository.findOne({where:{email: userDto.email}, include: {all: true}}); // Ищем пользователя по email.
    if (condidate){   // Сделаем проверку, вдруг пользователь с таким email уже существует.
      throw new HttpException(`Пользователь с почтовым адресом ${userDto.email} уже существует`, HttpStatus.BAD_REQUEST)
    }
    // Захэшируем пароль, если пользователя с таким емэйлом нет.
    const hashPassword = await bcrypt.hash(userDto.password, 5); // Первым параметром передаём пароль из Dto, а вторым соль.
    // const activationLink = uuid.v4();        // Создаём ссылку для активации аккаунта.
    // Создаём пользователя.
    const user = await this.createUser({...userDto, password: hashPassword,
      //activationLink: activationLink
    },{...profileDto}); // Разворачиваем userDto и перезаписываем пароль.

    // try {
    //   await this.mailService.sendActivationLink(userDto.email, `${process.env.API_URL}/auth/activate/${activationLink}`);  // Отправляем письмо со ссылкой на активационный эндпоинт.
    //   console.log('Активационная ссылка успешно отправлена');
    // } catch (error) {
    //   console.error('При отправке активационной ссылки, произошла ошибка:', error);
    // }

    const tokens = await this.tokenService.generateTokens({email:user.email, password: user.password, roles: user.roles});   // Генерируем токены из объекта класса CreateUserDto   ...user.roles, {...user.dataValues}
    await this.tokenService.save_or_refresh_refreshToken(user.ID_user, tokens.refreshToken);    // Запишем refreshToken в табличку token
    console.log(`Зарегистрирован пользователь ${user.ID_user}`);
    return {...tokens, user}  // Возвращаем токены и пользователя
  }

  // Создать пользователя.
  async createUser(dto: CreateUserDto, profileDto: UpdateProfileDto) {      // Функция принимает параметр dto, ждет объект класса CreateUserDto.
    const user = await this.userRepository.create(dto);                   // Обращаемся к нашей базе данных и передаем ей объект dto для создания пользователя.
    const role = await this.roleService.getRoleByValue('USER');       // при создании пользователя по умолчанию добавим ему роль USER (заранее добавив роль USER в таблицу roles).
    await user.$set('roles', role.Id_role);    // Устанавливаем соответствие между полями таблицы    !!!!!!!!!!!!!!!!!!!!!!!!!! 'roles', [role.Id_role] -> roles: [role]
    user.roles = role;  // [role]                        // Сохраняем в поле ролией пользователя, объект роли.
    //await user.update({ Id_role: role.Id_role, roles: [role] });                      //  Обновляем значение роли в таблице пользователей.
    await this.profileService.send({ cmd: 'update-profile' }, {'createProfileDto': profileDto, 'user': user})
    return user;
    // if (!profileDto){const profile = await this.profileRepository.create({});   // Если dto пустое создаём пользователю пустой профиль.
    //   await profile.update({ ID_user: user.ID_user });                               // Обновляем значение поля ID_user в таблице профилей, на id нового пользователя.
    //   return user;
    // }
    // const profile = await this.profileRepository.create({...profileDto});       // Создаём пользователю профиль из dtoProfile.
    // await profile.update({ ID_user: user.ID_user });
    // return user;                                                           // возвращаем пользователя.
  }

  // Возвращаем всех пользователей.
  getAllUsers() {
    return this.userService.getAllUsers()
  }

}

// async registrationNew(userDto) {
//   console.log('dto is in the auth service')
//   const condidate = await this.userRepository.findOne({where:{email: userDto.email}, include: {all: true}}); // Ищем пользователя по email.
//   if (condidate){   // Сделаем проверку, вдруг пользователь с таким email уже существует.
//     throw new HttpException(`Пользователь с почтовым адресом ${userDto.email} уже существует`, HttpStatus.BAD_REQUEST)
//   }
//   // Захэшируем пароль, если пользователя с таким емэйлом нет.
//   const hashPassword = await bcrypt.hash(userDto.password, 5); // Первым параметром передаём пароль из Dto, а вторым соль.
//   // Создаём пользователя.
//   const user = await this.createUserNew({...userDto, password: hashPassword,
//     //activationLink: activationLink
//   }); // Разворачиваем userDto и перезаписываем пароль.
//
//   const tokens = await this.tokenService.generateTokens({email:user.email, password: user.password, roles: user.roles});   // Генерируем токены из объекта класса CreateUserDto   ...user.roles, {...user.dataValues}
//   await this.tokenService.save_or_refresh_refreshToken(user.ID_user, tokens.refreshToken);    // Запишем refreshToken в табличку token
//   console.log(`Зарегистрирован пользователь ${user.ID_user}`);
//   return {...tokens, user}  // Возвращаем токены и пользователя
//
// }
//
// async createUserNew(dto: CreateUserDto)
// {
//   const user = await this.userRepository.create(dto);                   // Обращаемся к нашей базе данных и передаем ей объект dto для создания пользователя.
//   const role = await this.roleService.getRoleByValue('USER');       // при создании пользователя по умолчанию добавим ему роль USER (заранее добавив роль USER в таблицу roles).
//   await user.$set('roles', role.Id_role);    // Устанавливаем соответствие между полями таблицы    !!!!!!!!!!!!!!!!!!!!!!!!!! 'roles', [role.Id_role] -> roles: [role]
//   user.roles = role;  // [role]
//   return user;
// }

