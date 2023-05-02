import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Profile } from "@app/shared/models/profile.model";

@Injectable()
export class ProfileService {
  constructor(
      @InjectModel(Profile) private profileRepository: typeof Profile,
  ) {}

  async updateProfile(profileDto, user){
    if (!profileDto){const profile = await this.profileRepository.create({});   // Если dto пустое создаём пользователю пустой профиль.
      await profile.update({ ID_user: user.ID_user });                               // Обновляем значение поля ID_user в таблице профилей, на id нового пользователя.
      console.log(`Profile: ${JSON.stringify(profile)}, created`)
      return user;
    }
    const profile = await this.profileRepository.create({...profileDto});       // Создаём пользователю профиль из dtoProfile.
    await profile.update({ ID_user: user.ID_user });
    console.log(`Profile: ${JSON.stringify(profile)}, created`)
    return user;
  }

  async getAllProfiles() {
    return this.profileRepository.findAll()
  }

}
