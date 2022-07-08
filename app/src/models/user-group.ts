import { DataType, Model, Table, Column, ForeignKey } from "sequelize-typescript";
import { User } from "./user";
import { Group } from "./group";

@Table({
    tableName: "user_group",
    timestamps: false
})
export class UserGroup extends Model {
    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    user_id!: number

    @ForeignKey(() => Group)
    @Column({
        type: DataType.INTEGER
    })
    group_id!: number
}
  