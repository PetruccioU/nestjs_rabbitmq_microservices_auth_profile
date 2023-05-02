import {Controller, Inject} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ClientProxy, Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {SharedService} from "@app/shared";
import {RegistrationDto} from "../../user/src/dto/registration.dto";
import {CreateProfileDto} from "../../profile/src/dto/create-profile.dto";

@Controller()
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly sharedService: SharedService,

  ) {}

  // Проверка.
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() ctx: RmqContext){
    console.log('getting user fakie auth');
    this.sharedService.acknowledgeMessage(ctx);
    return {user: 'USER auth'};
  }

  // Регистрация.
  @MessagePattern({ cmd: 'registration' })
  async registration(
      @Ctx() ctx: RmqContext,
      @Payload('createUserDto') userDto: RegistrationDto,
      @Payload('createProfileDto') profileDto: CreateProfileDto,
  )
  {
    console.log(`userDto: ${JSON.stringify(userDto)}, profileDto: ${JSON.stringify(profileDto)}`);
    console.log('dto is in the auth controller');
    this.sharedService.acknowledgeMessage(ctx);  // Сообщение получено.
    return await this.authService.registration(   // Делегировали логику
        userDto,
        profileDto
    );
  }

  // Получить всех пользователей.
  @MessagePattern({ cmd: 'get-all-users' })
  async getAllUsers(
      @Ctx() ctx: RmqContext,
  )
  {
    this.sharedService.acknowledgeMessage(ctx);  // Сообщение получено.
    return this.authService.getAllUsers();
  }

}
