import { DataType, Model, Table, Column, CreatedAt, UpdatedAt } from "sequelize-typescript";

@Table({
    tableName: "group",
    timestamps: true,
  })
export class Group extends Model {
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
        type: DataType.INTEGER,
        allowNull: false
    })
    created_by!: number

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
