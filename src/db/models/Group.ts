import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, OneToMany } from 'typeorm';

import { Faculty } from './Faculty';
import { Assignment } from './Assignment';

@Unique([ 'name', 'faculty.id' ])

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    name: string;

    @Column()
        //@ts-ignore
    amountOfPeople: number;

    @ManyToOne(type => Faculty, faculty => faculty.groups, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    faculty: Faculty;

    @OneToMany(type => Assignment, assignment => assignment.group)
        //@ts-ignore
    assignments: Assignment[];
}
