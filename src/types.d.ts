import * as express from 'express';

// I'm gonna need userData property on express request object later in handlers
export interface myRequest extends express.Request {
    userData: {
        id: number;
    }
}
