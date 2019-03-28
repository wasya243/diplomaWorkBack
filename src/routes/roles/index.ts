import express from 'express';

import { getRoles } from './handlers';

export const routes = express.Router();

routes.get('/roles', getRoles);
