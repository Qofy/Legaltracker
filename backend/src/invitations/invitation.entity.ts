import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  case_id: string;

  @ManyToOne(() => Case, { eager: true })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @Column()
  invited_by_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'invited_by_id' })
  invited_by: User;

  @Column({ default: 'pending' })
  status: string; // pending, accepted, declined

  @Column({ type: 'datetime' })
  expires_at: Date;

  @CreateDateColumn()
  created_date: Date;
}
