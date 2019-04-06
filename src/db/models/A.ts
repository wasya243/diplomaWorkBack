import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import moment from 'moment';

@Entity()
export class A {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    name: string;

    @Column({ type: 'timestamptz', default: moment(Date.now()).format() })
        //@ts-ignore
    time: Date;
}
