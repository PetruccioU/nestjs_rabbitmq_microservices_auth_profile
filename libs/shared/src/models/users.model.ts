// Установим seqilized.
// npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
// npm install --save pg pg-hstore
// npm install --save-dev @types/sequelize

import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "@app/shared/models/roles.model";
import {Profile} from "@app/shared/models/profile.model";
import {Token} from "@app/shared/models/token.model";


// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface UserCreationAttrs{
    email:string,
    password:string,
    activationLink: string;
    isActivated: boolean;
    Id_role: number;
}

// Опишем модель того, как пользователь будет сохраняться в базе данных
@Table({tableName: 'users'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class User extends Model<User, UserCreationAttrs> { // Укажем как дженерик сам этот класс дженерики, и интерфейс UserCreationAttrs

    @ApiProperty({example: '1', description : 'Unique ident' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    ID_user: number;

    @ApiProperty({example: 'user@gmail.com', description : 'Unique email' })
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    email: string;

    @ApiProperty({example: '123qwe', description : 'Users password' })
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'adfsdgsgshsfhsfsfj', description : 'Activation link' })
    @Column({type: DataType.STRING, defaultValue: null, allowNull: true})
    activationLink: string;

    @ApiProperty({example: 'true', description : 'This user account is activated via email' })
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isActivated: boolean;

    @ApiProperty({example: '1', description : 'User role ident' })
    @ForeignKey(()=>Role)   // Обозначим поле как внешний ключ, связанный запись user с записью из таблицы профилей
    @Column({type: DataType.INTEGER})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    Id_role: number;

    @BelongsTo(()=>Role) // Создаём связь один к одному между таблицами Role и User, в БД
    roles: Role;    // roles: Role[], в случае если хотим иметь как массив, а не объект.

    @HasOne(()=>Profile)
    profile: Profile;

    @HasOne(()=>Token)
    token: Token;
}

