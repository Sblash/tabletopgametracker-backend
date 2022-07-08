import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany } from "sequelize-typescript";
import { Element } from "./element";
import { Log } from "./log";

@Table({
    tableName: "data",
    timestamps: true
})
export class Data extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    value!: string

    @ForeignKey(() => Element)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    element_id!: number

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