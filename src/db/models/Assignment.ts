import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import moment from 'moment';

import { Classroom } from './Сlassroom';
import { Group } from './Group';
import { DoubleLesson } from './DoubleLesson';

@Unique([ 'classroom', 'doubleLesson', 'group', 'assignmentDate' ])

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column({ type: 'timestamptz' })
        //@ts-ignore
    assignmentDate: string;

    @Column({ type: 'timestamptz', default: moment(Date.now()).format() })
        //@ts-ignore
    createdAt: string;

    @ManyToOne(type => Group, group => group.assignments, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    group: Group;

    @ManyToOne(type => DoubleLesson, doubleLesson => doubleLesson.assignments, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    doubleLesson: DoubleLesson;

    @ManyToOne(type => Classroom, classroom => classroom.assignments, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    classroom: Classroom;

}


