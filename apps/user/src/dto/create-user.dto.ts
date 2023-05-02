// класс будет возвращать простые объекты для хранения данных
import {ApiProperty} from "@nestjs/swagger";
import {Column, DataType, ForeignKey} from "sequelize-typescript";
//import {Profile} from "../../profile/profile.model";
//import {Role} from "../../roles/roles.model";
//import {Token} from "../../token/token.model";

export class CreateUserDto{

    @ApiProperty({example: 'user@gmail.com', description : 'Unique email' })
    readonly email: string;

    @ApiProperty({example: '123qwe', description : 'Users password' })
    readonly password: string;

    @ApiProperty({example: 'true', description : 'This user account is activated via email' })
    readonly isActivated: boolean;

    @ApiProperty({example: 'adfsdgsgshsfhsfsfj', description : 'Activation link' })
    readonly activationLink: string;

    @ApiProperty({example: '1', description : 'Role ident' })
    readonly Id_role: number;
}

// @ApiProperty({example: 'true', description : 'Is user banned?' })
// readonly banned: boolean;
//
// @ApiProperty({example: 'For vulgar language', description : 'Reason' })
// readonly banReason: string;

// @ApiProperty({example: '1', description : 'Profile ident' })
// readonly profileId: number;
//
// @ApiProperty({example: '1', description : 'Token ident' })
// readonly tokenId: number;




