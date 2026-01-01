import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('guest_passes')
export class GuestPass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column()
  case_id: string;

  @ManyToOne(() => Case, { eager: true })
  @JoinColumn({ name: 'case_id' })
  case: Case;

  @Column()
  email: string;

  @Column({ default: 'view_only' })
  access_level: string; // view_only, view_comment

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column()
  created_by_id: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by_id' })
  created_by: User;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_date: Date;
}
