import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('feature_requests')
export class FeatureRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'medium' })
  priority: string; // low, medium, high

  @Column({ default: 'submitted' })
  status: string; // submitted, under_review, planned, implemented, rejected

  @Column({ default: 0 })
  votes: number;

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
