import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { Faculty } from './Faculty';

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
}
