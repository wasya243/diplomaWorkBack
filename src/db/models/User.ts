import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Role } from './Role';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
        // @ts-ignore
    id: number;

    @Column({
        length: 100
    })
        // @ts-ignore
    firstName: string;

    @Column({
        length: 100
    })
        // @ts-ignore
    lastName: string;

    @Column({
        length: 100
    })
        // @ts-ignore
    email: string;

    @Column({
        nullable: true
    })
        // @ts-ignore
    sessionId: string;

    @Column()
        // @ts-ignore
    password: string;

    @ManyToOne(type => Role, role => role.users)
        //@ts-ignore
    role: Role;
}
