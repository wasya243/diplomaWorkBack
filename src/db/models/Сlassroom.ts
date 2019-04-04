import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, OneToMany } from 'typeorm';

import { Faculty } from './Faculty';
import { Request } from './Request';
import { Assignment } from './Assignment';

@Unique([ 'number', 'faculty.id' ])

@Entity()
export class Classroom {

    @PrimaryGeneratedColumn()
        // @ts-ignore
    id: number;

    @Column()
        // @ts-ignore
    number: number;

    @Column()
        // @ts-ignore
    amountOfSeats: number;


    @ManyToOne(type => Faculty, faculty => faculty.classrooms, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;

    @OneToMany(type => Request, request => request.classroom)
        //@ts-ignore
    requests: Request[];

    @OneToMany(type => Assignment, assignment => assignment.classroom)
        //@ts-ignore
    assignments: Assignment[];
}
