import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'tiempo_estudio_tipo', schema: 'public' })
export class TiempoEstudioTipo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'tiempo' })
  tiempo: number;

 
}
