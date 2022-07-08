import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, HasMany } from "sequelize-typescript";
import { Group } from "./group";
import { Page } from "./page";
import { Log } from "./log";

@Table({
  tableName: "game",
  timestamps: true,
})
export class Game extends Model {
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
    type: DataType.STRING,
    allowNull: true
  })
  profile_pic!: string

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  group_id!: number

  @HasMany(() => Page)
  pages!: Page[]

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
