import { Sequelize } from 'sequelize-typescript'
import { User } from '@models/user'
import { Group } from '@models/group'
import { Game } from '@models/game'

export const db = new Sequelize({
    host: 'db',
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PSW,
    models: [User, Group, Game]
})
