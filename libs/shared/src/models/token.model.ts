//import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "@app/shared/models/users.model";
import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";


// Добавим интерфейс для описания полей, нужных для создания объектов класса Token
interface TokenCreationAttrs{
    refreshToken:string,
    ID_user: number,
}

// Опишем модель того, как пользователь будет сохраняться в базе данных
@Table({tableName: 'token'})       // Пометим класс декоратором Table, чтобы класс стал таблицей в БД
export class Token extends Model<Token, TokenCreationAttrs> { // Укажем как дженерик сам этот класс, и интерфейс UserCreationAttrs

    @ApiProperty({example: '1', description : 'Unique ident' })   //Добавим полям модели декоратор ApiProperty, для документирования в swagger
    @Column({type: DataType.INTEGER, unique:true, autoIncrement: true, primaryKey:true})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column
    id: number;

    @ApiProperty({example: 'xxxxx.yyyyy.zzzzz', description : 'Jwt token' })
    @Column({type: DataType.STRING(1024),  allowNull: false})   //
    refreshToken: string;

    // Один токен относится к одному пользователю, через внешний ключ
    @ApiProperty({example: '1', description : 'User ident' })
    @ForeignKey(()=>User)   // Обозначим поле как внешний ключ, связанный запись user с записью из таблицы профилей
    @Column({type: DataType.INTEGER})  // Чтобы эти поля стали полями таблицы в БД, пометим их декоратором Column    // , unique:true
    ID_user: number;

    @BelongsTo(()=>User) // Создаём связь один к одному между таблицами token и user, одна запись из token принадлежит одной записи user.
    users: User;
}
