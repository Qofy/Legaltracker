import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  from_email: string;

  @Column({ nullable: true })
  to_email: string;

  @Column()
  from_role: string; // 'lawyer', 'customer', 'admin'

  @Column()
  to_role: string; // 'lawyer', 'customer', 'admin'

  @Column()
  subject: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  from_user_id: string;

  @Column({ nullable: true })
  to_user_id: string;

  @ManyToOne(() => User, { nullable: true })
  from_user: User;

  @ManyToOne(() => User, { nullable: true })
  to_user: User;

  @Column({ nullable: true })
  message_type: string; // 'message', 'report', 'case_report'

  @Column({ type: 'text', nullable: true })
  report_data: string; // JSON string for report metadata

  @Column({ nullable: true })
  status: string; // 'new', 'reviewed', 'archived'

  @Column({ type: 'text', nullable: true })
  file_attachment: string; // JSON string for file attachment data

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}