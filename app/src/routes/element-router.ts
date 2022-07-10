import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

// Constants
export const elementRouter = Router();
const { CREATED, OK } = StatusCodes;

// Paths
const p = {
    login: '/',
};

/**
 * Login with Telegram.
 */
elementRouter.post(p.login, async (_: Request, res: Response) => {
    // const users = await userService.addOne();
    // return res.status(OK).json({users});
});
