import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user';
import { Group } from '../models/group';
import { Game } from '../models/game';
import { UserGroup } from '../models/user-group';
import { Page } from '../models/page';
import { Element } from '../models/element';
import { Data } from '../models/data';
import { Log } from '../models/log';

export const db = new Sequelize({
    host: 'db',
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PSW,
    models: [User, Group, Game, UserGroup, Page, Element, Data, Log]
})
