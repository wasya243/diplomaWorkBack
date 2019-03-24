import express from 'express';

import { getPermissions } from './handlers';

export const routes = express.Router();

routes.get('/permissions', getPermissions);
