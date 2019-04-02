import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { Faculty } from './Faculty';

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
}
