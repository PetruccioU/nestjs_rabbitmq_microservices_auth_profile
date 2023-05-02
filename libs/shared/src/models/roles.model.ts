// Установим seqilized
// npm install --save @nestjs/sequelize sequelize sequelize-typescript mysql2
// npm install --save pg pg-hstore
// npm install --save-dev @types/sequelize

import {BelongsTo, ForeignKey, Column, DataType, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@app/shared/models/users.model";

// Добавим интерфейс для описания полей, нужных для создания объектов класса User
interface RoleCreationAttrs{
    value:string,
    description:string,
    ID_user: number,
}

// Опишем модель ролей
@Table({tableName: 'roles'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class Role extends Model<Role, RoleCreationAttrs> { // Укажем как дженерик сам этот класс и интерфейс RoleCreationAttrs

    @ApiProperty({example: '1', description : 'Unique ident' })
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    Id_role: number;

    @ApiProperty({example: 'ADMIN', description : 'Users role' })
    @Column({type: DataType.STRING, unique:true, allowNull: false})
    value: string;

    @ApiProperty({example: 'Administrator', description : 'Role descriptions' })
    @Column({type: DataType.STRING, allowNull: false})
    description: string;

    @HasOne(() => User)
    user: User[];
}



