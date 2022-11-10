import { User } from '../models/user';
import { Request } from 'express';
import { getUserByTelegramId } from '../repos/user-repo';
import { Op } from 'sequelize';

export function createUser(username: string, telegram_id: number) {
    let user = User.create({
        username: username,
        telegram_id: telegram_id
    });

    return user;
}

export function getJwtTokenFromRequest(req: Request) {
    let authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        let token = authorizationHeader.split(" ")[1];
        return token;
    }
    
    return false;
}

export async function getUserFromJwt(token: string): Promise<User | null> {
    let jwt = require('jsonwebtoken');
    let user: User | null = null;
    await jwt.verify(token, process.env.JWT_ACCESS_KEY, async function(err: any, decoded: any) {
        if (err) {
            console.log(err)
            return false;
        }
        const telegram_id: number = decoded.telegram_id;
        user = await getUserByTelegramId(telegram_id);
    })

    return user;
}

export async function searchUserByUsername(username: string): Promise<User[]> {
    return await User.findAll({
        attributes: ['id', 'username'],
        where: {
            username: {
                [Op.like]: '%' + username + '%'
            }
        }
    });
}