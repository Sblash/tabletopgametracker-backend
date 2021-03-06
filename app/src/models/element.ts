import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany } from "sequelize-typescript";
import { Page } from "./page";
import { Data } from "./data";
import { Log } from "./log";

@Table({
    tableName: "element",
    timestamps: true
})
export class Element extends Model {
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

    @ForeignKey(() => Page)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    page_id!: number

    @HasMany(() => Data)
    datas!: Data[]

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