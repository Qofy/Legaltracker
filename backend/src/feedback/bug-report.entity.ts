import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('bug_reports')
export class BugReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'medium' })
  severity: string; // low, medium, high, critical

  @Column({ default: 'open' })
  status: string; // open, in_progress, resolved

  @Column()
  submitted_by_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'submitted_by_id' })
  submitted_by: User;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
