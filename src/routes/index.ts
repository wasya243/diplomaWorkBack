import express from 'express';

import { routes as userRoutes } from './user';
import { routes as authRoutes } from './auth';

export const appRoutes = express.Router();

appRoutes
    .use(authRoutes)
    .use(userRoutes);
