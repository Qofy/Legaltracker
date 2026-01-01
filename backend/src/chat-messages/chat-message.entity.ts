import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'text' })
  message_type: string; // text, file, system

  @Column({ nullable: true })
  file_url: string;

  @Column({ nullable: true })
  file_name: string;

  @Column({ default: false })
  is_edited: boolean;

  @Column({ nullable: true })
  edited_at: Date;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case: Case;

  @Column()
  case_id: string;

  @ManyToOne(() => User)
  sender: User;

  @Column()
  sender_id: string;

  @CreateDateColumn()
  created_at: Date;
}
