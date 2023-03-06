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

@Entity({ name: 'maestro_inscripcion', schema: 'public' })
export class MaestroInscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bool', name: 'normalista' })
  normalista: boolean;

  @Column({ type: 'bool', name: 'vigente' })
  vigente: boolean;

  @Column({ type: 'varchar', name: 'formacion_descripcion' })
  formacionDescripcion: string;

  @Column({ type: 'bool', name: 'braile' })
  braile: boolean;
   
  
}
