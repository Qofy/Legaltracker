import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case: Case;

  @Column()
  case_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  comment_type: string;

  @Column({ type: 'boolean', default: true })
  is_shared: boolean;

  @Column({ type: 'boolean', default: false })
  is_internal: boolean;

  @ManyToOne(() => User)
  author: User;

  @Column()
  author_id: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
