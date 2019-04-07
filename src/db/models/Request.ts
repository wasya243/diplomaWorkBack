import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import moment from 'moment';

import { Classroom, Faculty } from '../models';

@Unique([ 'faculty', 'createdAt', 'classroom' ])

@Entity()
export class Request {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column({ type: 'timestamptz' })
        //@ts-ignore
    start: Date;

    @Column({ type: 'timestamptz' })
        //@ts-ignore
    end: Date;

    @Column({ type: 'boolean', default: false })
        //@ts-ignore
    isApproved: boolean;

    @Column({ type: 'timestamptz', default: moment(Date.now()).format() })
        //@ts-ignore
    createdAt: Date;

    @ManyToOne(type => Faculty, faculty => faculty.requests, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;

    @ManyToOne(type => Classroom, classroom => classroom.requests, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    classroom: Classroom;

}
