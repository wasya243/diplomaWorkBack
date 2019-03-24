import express from 'express';

import { routes as userRoutes } from './user';
import { routes as authRoutes } from './auth';
import { routes as permissionRoutes } from './permissions';

export const appRoutes = express.Router();

appRoutes
    .use(userRoutes)
    .use(permissionRoutes)
    .use(authRoutes);
