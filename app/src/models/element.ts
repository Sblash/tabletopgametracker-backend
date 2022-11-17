import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany, Index } from "sequelize-typescript";
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
        type: DataType.STRING,
        allowNull: false
    })
    type!: string

    @ForeignKey(() => Page)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        onDelete: "CASCADE"
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