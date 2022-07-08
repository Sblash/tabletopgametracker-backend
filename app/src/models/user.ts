import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, HasMany, BelongsToMany } from "sequelize-typescript";
import { Group } from "./group";
import { UserGroup } from "./user-group";
import { Log } from "./log";

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  username!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: true
  })
  telegram_id!: string

  @HasMany(() => Group)
  groups_created!: Group[]

  @BelongsToMany(() => Group, () => UserGroup)
  groups!: Group[]

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
