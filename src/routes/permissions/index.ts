import express from 'express';

import { getPermissions } from './handlers';

export const routes = express.Router();

// TODO: add auth & permission middleware
routes.get('/permissions', getPermissions);
