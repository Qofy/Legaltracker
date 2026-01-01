import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  case_number: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'open' })
  status: string; // open, in_progress, on_hold, closed, won, lost

  @Column({ default: 'medium' })
  priority: string; // low, medium, high, urgent

  @Column({ default: 'civil' })
  case_type: string; // civil, criminal, family, corporate, immigration, personal_injury, other

  @Column({ type: 'date', nullable: true })
  due_date: string;

  @Column({ type: 'date', nullable: true })
  court_date: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  case_value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  billing_rate: number;

  @Column({ type: 'int', nullable: true })
  estimated_hours: number;

  @Column({ nullable: true })
  court_name: string;

  @Column({ nullable: true })
  judge_name: string;

  @Column({ nullable: true })
  opposing_counsel: string;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  // Row-level security relations
  @ManyToMany(() => User)
  @JoinTable({ name: 'case_owners' })
  owners: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'case_customers' })
  customers: User[];

  @ManyToMany(() => User)
  @JoinTable({ name: 'case_shared_users' })
  shared_users: User[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
