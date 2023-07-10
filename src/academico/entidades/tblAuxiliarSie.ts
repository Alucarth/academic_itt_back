import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tbl_auxiliar_sie', schema: 'public' })
export class TblAuxiliarSie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'test' })
  test: string;

 
}
