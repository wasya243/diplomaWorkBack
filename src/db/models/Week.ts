import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Term } from './Term';

@Unique([ 'term.id', 'number' ])
@Entity()
export class Week {
    @PrimaryGeneratedColumn()
        //@ts-ignore
    id: number;

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

    @ManyToOne(type => Term, term => term.weeks, { cascade: true, onDelete: 'CASCADE' })
        //@ts-ignore
    term: Term;
}
