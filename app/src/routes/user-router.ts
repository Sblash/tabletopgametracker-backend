import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { User } from "../models/user";
import { searchUserByUsername } from '../services/user-service';

// Constants
const router = Router();
const { OK } = StatusCodes;

// Paths
const p = {
    search_username: '/search-by-username',
    // add: '/add',
    // update: '/update',
    // delete: '/delete/:id',
} as const;

/**
 * Search users by username.
 */
router.get(p.search_username, async (_: Request, res: Response) => {
    const username: any = _.query.username;
    
    if (!username) return res.status(OK).json({success: false, message: "username param can't be null."});

    let users: Array<User> = await searchUserByUsername(username);

    if (users.length <= 0) return res.status(OK).json({success: false, message: "No user found."});

    return res.status(OK).json({success: true, users: users});
});


/**
 * Add one user.
 */
// router.post(p.add, async (req: Request, res: Response) => {
//     const { user } = req.body;
//     // Check param
//     if (!user) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.addOne(user);
//     return res.status(CREATED).end();
// });


/**
 * Update one user.
 */
// router.put(p.update, async (req: Request, res: Response) => {
//     const { user } = req.body;
//     // Check param
//     if (!user) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.updateOne(user);
//     return res.status(OK).end();
// });


/**
 * Delete one user.
 */
// router.delete(p.delete, async (req: Request, res: Response) => {
//     const { id } = req.params;
//     // Check param
//     if (!id) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.delete(Number(id));
//     return res.status(OK).end();
// });


// Export default
export default router;
