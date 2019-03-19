import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class User {

    @PrimaryGeneratedColumn()
        // @ts-ignore
    id: number;

    @Column({
        length: 100
    })
        // @ts-ignore
    name: string;

    @Column({
        length: 100
    })
        // @ts-ignore
    email: string;
}
