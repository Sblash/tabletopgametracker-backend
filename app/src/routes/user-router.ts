import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import { ParamMissingError } from '@shared/errors';

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
const p = {
    get: '/',
    // add: '/add',
    // update: '/update',
    // delete: '/delete/:id',
} as const;


router.use((req, res, next) => {
    let jwt = require('jsonwebtoken');
    let authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) return res.status(400).send('Not logged in.');

    let token = authorizationHeader.split(" ")[1];
    let decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY, function(err: any, decoded: any) {
        if (err) {
            return res.status(401).json({
                "error": true,
                "message": 'Unauthorized access.'
            });
        }
        next();
    });
})

/**
 * Get all users.
 */
router.get(p.get, async (_: Request, res: Response) => {
    // const users = await userService.getAll();
    // return res.status(OK).json({users});
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
