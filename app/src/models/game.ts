import { DataType, Model, Table, Column, CreatedAt, UpdatedAt } from "sequelize-typescript";

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
