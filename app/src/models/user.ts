import { DataType, Model, Table, Column, CreatedAt, UpdatedAt } from "sequelize-typescript";

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
