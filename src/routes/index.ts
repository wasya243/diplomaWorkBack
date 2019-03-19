import express = require('express');

import { routes as userRoutes } from './user';

export const appRoutes = express.Router();

appRoutes
    .use(userRoutes);
