import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany, Index } from "sequelize-typescript";
import { Game } from "./game";
import { Element } from "./element";
import { User } from "./user";
import { Log } from "./log";

@Table({
    tableName: "page",
    timestamps: true
})
export class Page extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string

    @Index({
        name: 'slug_idx',
        type: 'UNIQUE',
        unique: true,
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    slug!: string

    @Column({
        type: DataType.JSON,
        allowNull: true
    })
    structure!: JSON

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    is_private!: boolean

    @ForeignKey(() => Game)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
    })
    game_id!: number

    @HasMany(() => Element)
    elements!: Element[]

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    created_by!: number

    @HasMany(() => Log)
    logs!: Log[]

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