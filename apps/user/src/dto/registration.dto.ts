//import {ApiProperty} from "@nestjs/swagger";

export class RegistrationDto{
    //@ApiProperty({example: 'user@gmail.com', description : 'Unique email' })
    readonly email: string;

    //@ApiProperty({example: '123qwe', description : 'Users password' })
    readonly password: string;
}