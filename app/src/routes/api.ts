import { Router } from 'express';
import userRouter from './user-router';
import { authRouter } from './auth-router';
import { groupRouter } from './group-router';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/users', userRouter);
baseRouter.use('/auth', authRouter);
baseRouter.use('/group', groupRouter);

// Export default.
export default baseRouter;
