import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Permission } from './Permission';

@Entity()
export class Resource {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    name: string;

    @OneToMany(type => Permission, permission => permission.resource)
        //@ts-ignore
    permissions: Permission[];
}
