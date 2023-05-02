import { Injectable } from '@nestjs/common';
import process from "process";
import {InjectModel} from "@nestjs/sequelize";
import {Token} from "@app/shared/models/token.model";
import {User} from "@app/shared/models/users.model";
const jwt = require('jsonwebtoken')
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TokenService {
  constructor(
      @InjectModel(Token) private tokenRepository: typeof Token, //
      @InjectModel(User) private userRepository: typeof User,
      private readonly configService: ConfigService,
  ) {}

  // Сгенерируем токены.
  async generateTokens(payload){   // Payload - это информация, которая будет спрятана в токене.

    const accessSecret = this.configService.get('JWT_ACCESS_SECRET');
    const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
    //const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '3h'});      //  Создадим jwt подпись из payload с ключем из переменной окружения JWT_ACCESS_SECRET, это accessToken. Срок жизни токена: 30 минут
    //const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});    //  Это refreshToken. Срок жизни токена: 30 дней
    const accessToken = jwt.sign(payload, accessSecret, {expiresIn: '3h'});
    const refreshToken = jwt.sign(payload, refreshSecret, {expiresIn: '30d'});

    console.log('Создана пара токенов');
    return {    // Возвращаем токены.
      accessToken,
      refreshToken
    }
  }

  // Обновим refreshToken в таблице token, или запишем его первый раз.
  async save_or_refresh_refreshToken(user_Id, refreshToken){
    const tokenData = await this.tokenRepository.findOne({where:{ID_user: user_Id}});  // Ищем токен пользователя по его user_Id.
    if(tokenData){   // Если токен нашёлся, перезаписываем его.
      // tokenData.refreshToken = refreshToken;
      // await tokenData.save();
      await tokenData.update({refreshToken: refreshToken});  // Сохраняем новый refreshToken в БД.
      console.log(`Токен пользователя ${user_Id} обновлён.`)
    }else{
      console.log('Создан новый токен.')
      return await this.tokenRepository.create({refreshToken: refreshToken, ID_user: user_Id }); // Если токен не был найден, значит пользователь логинится первый раз, создадим для него запись с refreshToken.
    }
  }

  // Проверим accessToken.
  async validateAccessToken(token){
    try {
      //const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);    // Проверяем токен.

      const accessSecret = this.configService.get('JWT_ACCESS_SECRET');
      const userData = jwt.verify(token, accessSecret);
      console.log(`TokenService: Валидирован объект ${JSON.stringify(userData)}`);

      return userData;    // Если токен валиден возвращаем данные из этого токена переменной userData.
    }catch (e){
      console.log('TokenService: Ошибка валидации AccessToken')
      console.log(e);
      return null;
    }
  }

  // Проверим refreshToken.
  async validateRefreshToken(token){
    try {

      //const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);   // Проверяем токен.

      const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
      const userData = jwt.verify(token, refreshSecret);
      console.log(`TokenService: Валидирован объект ${JSON.stringify(userData)}`);
      return userData;      // Если токен валиден возвращаем данные из этого токена переменной userData.
    }catch (e){
      console.log('TokenService: Ошибка валидации RefreshToken')
      console.log(e);
      return null;
    }
  }

  // Поиск refreshToken'а.
  async findRefreshToken(refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({where:{refreshToken: refreshToken}}) // Находим токен в БД.
    console.log(`Токен найден`)
    return tokenData
  }

  // Удаление токена.
  async removeToken(refreshToken: string) {
    const tokenData = await this.tokenRepository.destroy({where:{refreshToken: refreshToken}}) // Удаляем токен из БД.
    console.log(`Токен пользователя удалён`)
    return tokenData
  }

}
