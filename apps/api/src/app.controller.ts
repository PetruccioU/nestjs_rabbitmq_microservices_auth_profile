import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import { AppService } from './app.service';
import {ClientProxy} from "@nestjs/microservices";
import { RegistrationDto } from 'apps/user/src/dto/registration.dto';
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";

@Controller('api')
export class AppController {
  constructor(
      @Inject('PROFILE_SERVICE') private profileService: ClientProxy,
      @Inject('AUTH_SERVICE') private authService: ClientProxy
  ) {}

  // Проверим микросервисы:
  @Get('get_user_profile')
  async getUserProfile(){
    return this.profileService.send({ cmd: 'get-user' }, {});
  }

  @Get('get_user_auth')
  async getUserAuth(){
    return this.authService.send({ cmd: 'get-user' }, {});
  }


  // Регистрация.
  @Post('registration')
  async registration(
      @Body('createUserDto') registrationDto: RegistrationDto,
      @Body('createProfileDto') profileDto: CreateProfileDto
  )
  {
    // По токену 'PROFILE_SERVICE' отправляем команду через RabbitMQ
    console.log('cmd sent from the app controller');
    return await this.authService.send({ cmd: 'registration' }, {
      'createUserDto': registrationDto,
      'createProfileDto': profileDto,
    });
  }

  // Получить всех пользователей.
  @Get('get_all_user')
  async getAllUsers()
  {
    return this.authService.send({ cmd: 'get-all-users' }, {});
  }

  // Получить все профили.
  @Get('get_all_profiles')
  async getAllProfiles()
  {
    return this.profileService.send({ cmd: 'get-all-profiles' }, {});
  }

}
