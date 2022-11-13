import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany } from "sequelize-typescript";
import { Element } from "./element";
import { Log } from "./log";

@Table({
    tableName: "data",
    timestamps: true
})
export class Data extends Model {
    @Column({
        type: DataType.JSON,
        allowNull: true
    })
    value!: JSON

    @ForeignKey(() => Element)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
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