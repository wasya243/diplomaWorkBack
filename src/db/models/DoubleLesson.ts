import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Assignment } from './Assignment';

@Entity()
export class DoubleLesson {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

    @Index({ unique: true })
    @Column()
        //@ts-ignore
    number: number;

    @Index({ unique: true })
    @Column({ type: 'timestamptz' })
        //@ts-ignore
    start: string;

    @Index({ unique: true })
    @Column({ type: 'timestamptz' })
        //@ts-ignore
    end: string;

    @OneToMany(type => Assignment, assignment => assignment.doubleLesson)
        //@ts-ignore
    assignments: Assignment[];
}
