// класс будет возвращать простые объекты для хранения данных профиля
import {ApiProperty} from "@nestjs/swagger";

export class CreateProfileDto{

    @ApiProperty({example: 'dto: John Doe', description : 'dto: Persons full name' })
    readonly fullName: string;

    @ApiProperty({example: 'dto: +7-222-333-322-233', description : 'dto: Persons phone number' })
    readonly phoneNumber: string;

    @ApiProperty({example: 'dto: Green srt. 42', description : 'dto: Persons mailing address' })
    readonly mailAddress: string;
}