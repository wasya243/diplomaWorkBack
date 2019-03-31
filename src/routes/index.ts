import express from 'express';

import { routes as userRoutes } from './user';
import { routes as authRoutes } from './auth';
import { routes as permissionRoutes } from './permissions';
import { routes as roleRoutes } from './roles';
import { routes as facultyRoutes } from './faculty';

export const appRoutes = express.Router();

appRoutes
    .use(userRoutes)
    .use(permissionRoutes)
    .use(roleRoutes)
    .use(facultyRoutes)
    .use(authRoutes);
