import express from 'express';

import { signIn, signOut, signUp } from './handlers';
import { authMiddleware } from '../../auth';

export const routes = express.Router();

// TODO: fix type error on myRequest
// @ts-ignore
routes.post('/auth/sign-out', authMiddleware, signOut);

routes.post('/auth/sign-in', signIn);

routes.post('auth/sign-up', signUp);
