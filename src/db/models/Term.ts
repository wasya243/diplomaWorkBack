import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Week } from './Week';

@Unique([ 'number', 'year' ])
@Entity()
export class Term {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Column()
        //@ts-ignore
    number: number;

    @Column()
        //@ts-ignore
    year: number;

    @OneToMany(type => Week, week => week.term)
        //@ts-ignore
    weeks: Week[];
}
