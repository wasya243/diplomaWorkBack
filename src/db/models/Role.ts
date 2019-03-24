import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    name: string;

    @OneToMany(type => Permission, permission => permission.role)
        //@ts-ignore
    permissions: Permission[];

    @OneToMany(type => User, user => user.role)
        //@ts-ignore
    users: User[];
}
