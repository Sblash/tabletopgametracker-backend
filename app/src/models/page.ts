import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany } from "sequelize-typescript";
import { Game } from "./game";
import { Element } from "./element";
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

    @ForeignKey(() => Game)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    game_id!: number

    @HasMany(() => Element)
    elements!: Element[]

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