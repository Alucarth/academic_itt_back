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
import { EducacionTipo } from './educacionTipo.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { Operativo } from './operativo.entity';

@Entity({ name: 'pais_tipo', schema: 'public' })
export class PaisTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'pais' })
  pais: string;

  @Column({ type: 'varchar', name: 'desc_abreviacion' })
  descAbreviacion: string;
    
  
  
}
