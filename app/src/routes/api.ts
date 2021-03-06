import { Router } from 'express';
import userRouter from './user-router';
import { authRouter } from './auth-router';
import { groupRouter } from './group-router';
import { gameRouter } from './game-router';
import { pageRouter } from './page-router';
import { elementRouter } from './element-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/user', userRouter);
baseRouter.use('/auth', authRouter);
baseRouter.use('/group', groupRouter);
baseRouter.use('/game', gameRouter);
baseRouter.use('/page', pageRouter);
baseRouter.use('/element', elementRouter);

// Export default.
export default baseRouter;
