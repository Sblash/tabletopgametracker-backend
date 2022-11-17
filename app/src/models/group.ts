import { DataType, Model, Table, Column, CreatedAt, UpdatedAt, ForeignKey, BelongsToMany, HasMany } from "sequelize-typescript";
import { User } from "./user";
import { UserGroup } from "./user-group";
import { Game } from "./game";
import { Log } from "./log";


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
        type: DataType.STRING,
        allowNull: true
    })
    profile_pic!: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    created_by!: number

    @BelongsToMany(() => User, () => UserGroup)
    users!: User[]

    @HasMany(() => Game)
    games!: Game[]

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
