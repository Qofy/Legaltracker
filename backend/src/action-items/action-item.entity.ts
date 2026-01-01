import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('action_items')
export class ActionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case: Case;

  @Column()
  case_id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  due_date: string;

  @Column({ default: 'pending' })
  status: string; // pending, completed, cancelled

  @ManyToOne(() => User, { nullable: true })
  assigned_to: User;

  @Column({ nullable: true })
  assigned_to_id: string;

  @ManyToOne(() => User)
  created_by: User;

  @Column()
  created_by_id: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
