import express from 'express';

import { signIn, signOut, signUp } from './handlers';
import { authMiddleware } from '../../auth';

export const routes = express.Router();

routes.post('/auth/sign-out', authMiddleware, signOut);

routes.post('/auth/sign-in', signIn);

routes.post('/auth/sign-up', signUp);
