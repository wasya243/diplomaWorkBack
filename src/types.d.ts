import * as express from 'express';

// I'm gonna need userData property on express request object later in handlers
export interface myRequest extends express.Request {
    userData: {
        id: number;
    }
}

export interface ProcessedPermission {
    id: number;
    action: string;
    role: string;
    resource: string;
}


export interface RawPermission {
    id: number;
    action: {
        id: number;
        name: string;
    };
    role: {
        id: number;
        name: string;
    };
    resource: {
        id: number;
        name: string;
    };
}
