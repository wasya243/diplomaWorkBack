import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Permission } from './Permission';

@Entity()
export class Action {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    name: string;

    @OneToMany(type => Permission, permission => permission.action)
        //@ts-ignore
    permissions: Permission[];
}
