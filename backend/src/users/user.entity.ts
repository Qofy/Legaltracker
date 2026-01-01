import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserType {
  ADMIN = 'admin',
  LAWYER = 'lawyer',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  full_name: string;

  @Column({ default: 'customer' })
  user_type: string; // admin, lawyer, customer, guest

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  bar_number: string; // For lawyers

  @Column({ type: 'text', nullable: true })
  specializations: string; // Comma-separated list for lawyers

  @Column({ nullable: true })
  firm_name: string; // For lawyers

  @Column({ nullable: true })
  address: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
