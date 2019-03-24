import { RawPermission, ProcessedPermission, ProcessedJoiValidationError, RawJoiValidationError } from '../types';

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

// this method is used to process joi error
export function composeJoiValidationError(errorDetails: RawJoiValidationError[]): ProcessedJoiValidationError[] {
    return errorDetails.map(item => Object.assign({}, { key: item.context.key, message: item.message }));
}
