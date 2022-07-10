import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { getUserByTelegramId } from "../repos/user-repo";
import { User } from '../models/user';
import { createUser } from '@services/user-service';
import { ParamMissingError } from '@shared/errors';
import { decode } from 'punycode';

// Constants
export const authRouter = Router();
const { CREATED, OK, BAD_REQUEST } = StatusCodes;

// Paths
const p = {
    login: '/',
    refresh_token: '/refresh'
};

/**
 * Login with Telegram.
 */
authRouter.post(p.login, async (_: Request, res: Response) => {
    let jwt = require('jsonwebtoken');
    let telegram_id: number = _.body.telegram_id;
    let username: string = _.body.username;

    if (!telegram_id) throw new ParamMissingError();
    if (!username) throw new ParamMissingError();

    let user: User | null = await getUserByTelegramId(telegram_id);

    if (!user) {
        user = await createUser(username, telegram_id);
    }

    let userObject = {
        telegram_id: user.telegram_id,
        username: user.username
    }

    let token: string = jwt.sign(userObject, process.env.JWT_ACCESS_KEY, { expiresIn: 900})
    let refresh_token: string = jwt.sign(userObject, process.env.JWT_REFRESH_KEY, { expiresIn: 86400})

    res.status(OK).json({
        "access_token": token,
        "refresh_token": refresh_token
    });   
});

/**
 * Refresh authentication.
 */
 authRouter.post(p.refresh_token, async (req: Request, res: Response) => {
    let jwt = require('jsonwebtoken');
    let authorization_header = req.headers.authorization;

    if (!authorization_header) return res.status(400).send('Not logged in.');

    let token = authorization_header.split(" ")[1];
    let decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);

    let telegram_id: number = decoded.telegram_id;

    let user: User | null = await getUserByTelegramId(telegram_id);

    if (!user) {
        return res.status(BAD_REQUEST).json({
            "message": "User not found."
        });
    }

    let userObject = {
        telegram_id: user.telegram_id
    }

    let newToken: string = jwt.sign(userObject, process.env.JWT_ACCESS_KEY, { expiresIn: 900})

    res.status(OK).json({
        "access_token": newToken
    });
});