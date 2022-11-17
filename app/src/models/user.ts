import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, HasMany, BelongsToMany, Index } from "sequelize-typescript";
import { Group } from "./group";
import { UserGroup } from "./user-group";
import { Log } from "./log";

@Table({
  tableName: "user",
  timestamps: true,
})
export class User extends Model {
  @Index({
    name: 'username_idx',
    type: 'UNIQUE',
    unique: true,
  })
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  username!: string

  @Index({
    name: 'telegram_id_idx',
    type: 'UNIQUE',
    unique: true,
  })
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
