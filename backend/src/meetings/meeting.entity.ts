import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('meetings')
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  meeting_date: Date;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number;

  @Column({ nullable: true })
  location: string; // Physical location or virtual meeting link

  @Column({ default: 'general' })
  meeting_type: string; // consultation, court, deposition, client_meeting, team_meeting, general

  @Column({ default: 'scheduled' })
  status: string; // scheduled, in_progress, completed, cancelled

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  agenda: string;

  @Column({ type: 'text', nullable: true })
  outcome: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case: Case;

  @Column()
  case_id: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'meeting_attendees' })
  attendees: User[];

  @ManyToOne(() => User)
  created_by: User;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
