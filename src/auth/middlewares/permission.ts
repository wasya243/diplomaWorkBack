import * as express from 'express';
import createHttpError = require('http-errors');

import { ProcessedPermission } from '../../types';
import { PermissionManager } from '../../db/permission-manager';

function isAllowedPermission(role: string, resource: string, action: string, permissions: ProcessedPermission[]): Boolean {
    return permissions.some(item => item.action === action && item.role === role && item.resource === resource);
}

function checkPermissionFor(action: string, resource: string) {

    return function permissionMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
        // @ts-ignore
        // TODO: fix problem with myRequest type
        return isAllowedPermission(req.userData.role, resource, action, PermissionManager.getPermissions() || [])
            ? next()
            : next(createHttpError(403, 'Permission denied'));
    };
}

export const checkPermission = {
    create: (resource: string) => checkPermissionFor('create', resource),
    read: (resource: string) => checkPermissionFor('read', resource),
    update: (resource: string) => checkPermissionFor('update', resource),
    delete: (resource: string) => checkPermissionFor('delete', resource)
};



