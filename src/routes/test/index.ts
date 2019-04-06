import express from 'express';
import { getA } from './handlers';

export const routes = express.Router();

routes.get('/a', getA);
