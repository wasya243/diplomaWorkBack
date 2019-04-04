import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import moment from 'moment';

import { User } from './User';
import { Classroom } from './Сlassroom';

@Unique([ 'dispatcher', 'createdAt', 'classroom' ])

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column({ type: 'timestamp' })
        //@ts-ignore
    start: string;

    @Column({ type: 'timestamp' })
        //@ts-ignore
    end: string;

    @Column({ type: 'boolean', default: false })
        //@ts-ignore
    isApproved: boolean;

    @Column({ type: 'timestamp', default: moment().format() })
        //@ts-ignore
    createdAt: string;

    @ManyToOne(type => User, dispatcher => dispatcher.requests, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    dispatcher: User;

    @ManyToOne(type => Classroom, classroom => classroom.requests, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    classroom: Classroom;

}
