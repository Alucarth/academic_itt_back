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
import { AsignaturaTipo } from './asignaturaTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { OfertaCurricular } from './ofertaCurricular.entity';
import { PlanEstudioAsignatura } from './planEstudioAsignatura.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';
import { RegimenGradoTipo } from './regimenGradoTipo.entity';

@Entity({ name: 'plan_estudio_asignatura_regla', schema: 'public' })
export class PlanEstudioAsignaturaRegla {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'horas' })
  horas: number;
  
  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_registro',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaRegistro: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;

  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'plan_estudio_asignatura_id', nullable:false })
  planEstudioAsignaturaId: number;

  @ManyToOne(() => PlanEstudioAsignatura, (planEstudioAsignatura) => planEstudioAsignatura.planesAsignaturasReglas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_asignatura_id', referencedColumnName: 'id'})
  planEstudioAsignatura: PlanEstudioAsignatura;

  @Column({ name: 'plan_estudio_asignatura_id', nullable:false })
  anteriorPlanEstudioAsignaturaId: number;

  @ManyToOne(() => PlanEstudioAsignatura, (planEstudioAsignatura) => planEstudioAsignatura.planesAsignaturasReglas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_asignatura_id', referencedColumnName: 'id'})
  anteriorPlanEstudioAsignatura: PlanEstudioAsignatura;

}
