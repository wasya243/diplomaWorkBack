import { RawPermission, ProcessedPermission } from '../types';

// this function is used to generate sessionId
export function simpleUniqueId() {
    return `${Math.random().toString().substring(2)}.${Date.now()}`;
}

// this method is used to process permissions array returned from database
export function processPermissions(rawPermissions: RawPermission[]): ProcessedPermission[] {
    return rawPermissions.map(item => Object.assign({}, {
        action: item.action.name,
        role: item.role.name,
        resource: item.resource.name,
        id: item.id
    }));
}
