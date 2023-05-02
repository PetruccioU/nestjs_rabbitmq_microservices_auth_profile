import {Controller} from '@nestjs/common';
import {ProfileService} from './profile.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {SharedService} from "@app/shared";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {User} from "@app/shared/models/users.model";
import {RegistrationDto} from "../../user/src/dto/registration.dto";

@Controller()
export class ProfileController {
  constructor(
      private readonly profileService: ProfileService,
      private readonly sharedService: SharedService,
  ) {}

  // Проверка.
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() ctx: RmqContext){
    console.log('getting user fakie profile');
    // const channel = ctx.getChannelRef();
    // const message = ctx.getMessage();
    // channel.ack(message);
    this.sharedService.acknowledgeMessage(ctx);
    return {user: 'USER profile'};
  }

  // Создаём профиль пользователя.
  @MessagePattern({ cmd: 'update-profile' })
  async updateProfile(@Ctx() ctx: RmqContext,
                      @Payload('createProfileDto') profileDto: CreateProfileDto,
                      @Payload('user') user: User,
  ){
    console.log('dto is in the profile controller');
    console.log(`profileDto: ${JSON.stringify(profileDto)}, user: ${JSON.stringify(user)}`);
    await this.sharedService.acknowledgeMessage(ctx);
    return await this.profileService.updateProfile(profileDto, user);
  }

  // Получить все профили.
  @MessagePattern({ cmd: 'get-all-profiles' })
  async getAllProfiles(@Ctx() ctx: RmqContext,
  ){
    console.log('Get all profiles');
    await this.sharedService.acknowledgeMessage(ctx);
    return await this.profileService.getAllProfiles();
  }

}

// @MessagePattern({ cmd: 'registration' })
// async registrationProfile(@Ctx() ctx: RmqContext,
//                     @Payload('createProfileDto') profileDto: CreateProfileDto,
//                     @Payload('user') user: User,
// ){
//   console.log('dto is in the profile controller');
//   console.log(`profileDto: ${JSON.stringify(profileDto)}, user: ${JSON.stringify(user)}`);
//   await this.sharedService.acknowledgeMessage(ctx);
//   return await this.profileService.updateProfile(profileDto, user);
// }

// @MessagePattern({ cmd: 'update-profile-from-auth-controller' })
// async updateProfileFromController(@Ctx() ctx: RmqContext,
// ){
//   this.sharedService.acknowledgeMessage(ctx);
//   console.log('updateProfileFromController');
// }

