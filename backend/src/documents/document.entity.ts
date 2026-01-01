import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Case } from '../cases/case.entity';
import { User } from '../users/user.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  file_name: string;

  @Column({ nullable: true })
  file_path: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  document_type: string; // contract, evidence, court_filing, correspondence, other

  @Column({ type: 'int', nullable: true })
  file_size: number;

  @Column({ type: 'text', nullable: true })
  ocr_text: string;

  @Column({ default: false })
  is_confidential: boolean;

  @Column({ nullable: true })
  submitted_by_party: string; // us, counterpart, them

  @Column({ type: 'int', default: 0 })
  points_awarded: number;

  @Column({ default: 'case_members' })
  visibility_type: string; // public, case_members, lawyers_only, specific_users

  @ManyToOne(() => Case, { onDelete: 'CASCADE' })
  case: Case;

  @Column()
  case_id: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'document_visible_to' })
  visible_to_users: User[];

  @ManyToOne(() => User)
  uploaded_by: User;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
