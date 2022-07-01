import { Sequelize } from 'sequelize'

const db = new Sequelize({
    host: 'db',
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PSW
})

export default db