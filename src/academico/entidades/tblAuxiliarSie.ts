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

@Entity({ name: 'bth_cut_ttm_estudiante', schema: 'public' })
export class TblAuxiliarSie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'registrosDatos' })
  registrosDatos: string;

 
}
