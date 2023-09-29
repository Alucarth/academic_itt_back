import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';
import { Tarea } from './tarea.entity';
import { PlanEstudioCarreraSeguimiento } from './planEstudioCarreraSeguimiento.entity';

@Entity({ name: 'estado_instituto', schema: 'public' })
export class EstadoInstituto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'estado' })
  estado: string;
  
  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;
  
  @Exclude()
  @CreateDateColumn({
    name: 'fecha_registro',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date;

  
  @OneToMany(() => PlanEstudioCarreraSeguimiento, (planEstudioCarreraSeguimiento) => planEstudioCarreraSeguimiento.estadoInstituto, { cascade: true })
  planesSeguimientos: PlanEstudioCarreraSeguimiento[];
}
