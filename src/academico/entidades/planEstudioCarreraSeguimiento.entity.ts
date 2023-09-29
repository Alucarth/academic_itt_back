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

import { PlanEstudioCarrera } from './planEstudioCarrera.entity';
import { ProcesoTipo } from './procesoTipo.entity';
import { EstadoInstituto } from './estadoInstituto.entity';

@Entity({ name: 'plan_estudio_carrera_seguimiento', schema: 'public' })
export class PlanEstudioCarreraSeguimiento {

  @PrimaryGeneratedColumn()
  id: number;
    
  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Exclude()
  @CreateDateColumn({
    name: 'fecha_registro',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date;

  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'plan_estudio_carrera_id', nullable:false })
  planEstudioCarreraId: number;

  @ManyToOne(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.planesSeguimientos, { nullable: false, eager: true })
  @JoinColumn({ name: 'plan_estudio_carrera_id', referencedColumnName: 'id'})
  planEstudioCarrera: PlanEstudioCarrera;

  @Column({ name: 'estado_instituto_id', nullable:false })
  estadoInstitutoId: number;

  @ManyToOne(() => EstadoInstituto, (estadoInstituto) => estadoInstituto.planesSeguimientos, { nullable: false, cascade: false })
  @JoinColumn({ name: 'estado_instituto_id', referencedColumnName: 'id'})
  estadoInstituto: EstadoInstituto;

}