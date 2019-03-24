import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { Action } from './Action';
import { Role } from './Role';
import { Resource } from './Resource';

@Unique([ 'action', 'role', 'resource' ])
@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @ManyToOne(type => Action, action => action.permissions)
        //@ts-ignore
    action: Action;

    @ManyToOne(type => Role, role => role.permissions)
        //@ts-ignore
    role: Role;

    @ManyToOne(type => Resource, resource => resource.permissions)
        //@ts-ignore
    resource: Resource;
}
