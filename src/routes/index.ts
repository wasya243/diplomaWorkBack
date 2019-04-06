import express from 'express';

import { routes as userRoutes } from './user';
import { routes as authRoutes } from './auth';
import { routes as permissionRoutes } from './permissions';
import { routes as roleRoutes } from './roles';
import { routes as facultyRoutes } from './faculty';
import { routes as classroomRoutes } from './classroom';
import { routes as groupRoutes } from './groups';
import { routes as doubleLessonRoutes } from './double-lessons';
import { routes as requestRoutes } from './requests';
import { routes as aRoutes } from './test';

export const appRoutes = express.Router();

appRoutes
    .use(aRoutes)
    .use(userRoutes)
    .use(permissionRoutes)
    .use(roleRoutes)
    .use(facultyRoutes)
    .use(classroomRoutes)
    .use(groupRoutes)
    .use(doubleLessonRoutes)
    .use(requestRoutes)
    .use(authRoutes);
