import { Router } from 'express';
import userRouter from './user-router';
import { authRouter } from './auth-router';
import { groupRouter } from './group-router';
import { gameRouter } from './game-router';
import { pageRouter } from './page-router';
import { elementRouter } from './element-router';
import { dataRouter } from './data-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/user', userRouter);
baseRouter.use('/auth', authRouter);

//CHECK JWT AUTHENTICATION
baseRouter.use(function (req, res, next) {
    let jwt = require('jsonwebtoken');
    let authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) return res.status(400).json({ message: 'Not logged in.' });

    let token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_ACCESS_KEY, function(err: any, decoded: any) {
        if (err) {
            console.log(err)
            return res.status(401).json({
                "error": true,
                "message": 'Unauthorized access.'
            });
        }

        next();
    })
});

baseRouter.use('/groups', groupRouter);
baseRouter.use('/games', gameRouter);
baseRouter.use('/pages', pageRouter);
baseRouter.use('/elements', elementRouter);
baseRouter.use('/datas', dataRouter);

// Export default.
export default baseRouter;
