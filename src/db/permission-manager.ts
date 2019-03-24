import { Connection } from 'typeorm';

import { ProcessedPermission, RawPermission } from '../types';
import { Permission } from './models';

export class PermissionManager {
    private static permissions: ProcessedPermission[];

    public static setPermissions(permissions: ProcessedPermission[]): void {
        if (!PermissionManager.permissions) {
            PermissionManager.permissions = permissions;
        }
    }

    public static getPermissions(): ProcessedPermission[] | undefined {
        return PermissionManager.permissions;
    }

    public static loadPermissions(connection: Connection): Promise<RawPermission[]> | undefined {
        if (!PermissionManager.permissions) {
            const permissionRepository = connection.getRepository(Permission);
            return permissionRepository.find({ relations: [ 'action', 'role', 'resource' ] });
        }
    }
}
