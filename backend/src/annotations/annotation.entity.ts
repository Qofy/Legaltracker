import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Document } from '../documents/document.entity';
import { User } from '../users/user.entity';

@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Document, { onDelete: 'CASCADE' })
  document: Document;

  @Column()
  document_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int', nullable: true })
  page_number: number;

  @Column({ type: 'float', nullable: true })
  position_x: number;

  @Column({ type: 'float', nullable: true })
  position_y: number;

  @ManyToOne(() => User)
  author: User;

  @Column()
  author_id: number;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}
