import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import userService from '@services/user-service';

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/',
} as const;

/**
 * Login with Telegram.
 */
 router.post(p.login, async (_: Request, res: Response) => {
    // const users = await userService.addOne();
    // return res.status(OK).json({users});
});

// Export default
export default router;