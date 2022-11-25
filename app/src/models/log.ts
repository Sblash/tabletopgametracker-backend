import { DataType, Model, Table, Column, CreatedAt, ForeignKey, UpdatedAt } from "sequelize-typescript";
import { User } from './user';
import { Group } from './group';
import { Game } from './game';
import { Page } from './page';
import { Element } from './element';
import { Data } from './data';

@Table({
    tableName: "log",
    timestamps: true
})
export class Log extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    user_id!: string

    @ForeignKey(() => Group)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    group_id!: string

    @ForeignKey(() => Game)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    game_id!: string

    @ForeignKey(() => Page)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    page_id!: string

    @ForeignKey(() => Element)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    element_id!: string

    @ForeignKey(() => Data)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    data_id!: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    action!: string

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    message!: string

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    created_at!: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    updated_at!: Date;
}