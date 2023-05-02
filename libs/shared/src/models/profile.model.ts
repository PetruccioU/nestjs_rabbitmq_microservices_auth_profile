// Установим sequelize
// npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
// npm install --save pg pg-hstore
// npm install --save-dev @types/sequelize

import {BelongsTo, BelongsToMany, Column,
    DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@app/shared/models/users.model";


// Добавим интерфейс для описания полей, нужных для создания объектов класса Profile
interface ProfileCreationAttrs{
    fullName:string,
    phoneNumber:string,
    mailAddress: string,
    ID_user: number
}

// Опишем модель того, как пользователь будет сохраняться в базе данных
@Table({tableName: 'profile'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class Profile extends Model<Profile, ProfileCreationAttrs> { // Укажем как дженерик сам этот класс и интерфейс RoleCreationAttrs

    @ApiProperty({example: '1', description : 'Unique ident' })
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    id: number;

    @ApiProperty({example: 'John Doe', description : 'Persons full name' })
    @Column({type: DataType.STRING, unique:true, allowNull: true})
    fullName: string;

    @ApiProperty({example: '+7-222-333-322-233', description : 'Persons phone number' })
    @Column({type: DataType.STRING, unique:true, allowNull: true})
    phoneNumber: string;

    @ApiProperty({example: 'Green srt. 42', description : 'Persons mailing address' })
    @Column({type: DataType.STRING, unique:true, allowNull: true})
    mailAddress: string;

    // Один профиль относится к одному пользователю, через внешний ключ
    @ApiProperty({example: '1', description : 'User ident' })
    @ForeignKey(()=>User)   // Обозначим поле как внешний ключ, связанный с записью из таблицы пользователей
    @Column({type: DataType.INTEGER, unique:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    ID_user: number;

    @BelongsTo(()=>User) // Создаём связь один к одному между таблицами Profile и User, одна запись из Profile принадлежит одной записи User.
    users: User;
}
