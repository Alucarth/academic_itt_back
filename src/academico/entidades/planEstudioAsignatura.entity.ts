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
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';
import { RegimenGradoTipo } from './regimenGradoTipo.entity';

@Entity({ name: 'plan_estudio_asignatura', schema: 'public' })
export class PlanEstudioAsignatura {
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

  @Column({ name: 'plan_estudio_carrera_id', nullable:false })
  planEstudioCarreraId: number;

  @ManyToOne(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.planesAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_carrera_id', referencedColumnName: 'id'})
  planEstudioCarrera: PlanEstudioCarrera;

  @Column({ name: 'regimen_grado_tipo_id', nullable:false })
  regimenGradoTipoId: number;

  @ManyToOne(() => RegimenGradoTipo, (regimenGradoTipo) => regimenGradoTipo.planesAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'regimen_grado_tipo_id', referencedColumnName: 'id'})
  regimenGradoTipo: RegimenGradoTipo;

  @Column({ name: 'asignatura_tipo_id', nullable:false })
  asignaturaTipoId: number;

  @ManyToOne(() => AsignaturaTipo, (asignaturaTipo) => asignaturaTipo.planesAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'asignatura_tipo_id', referencedColumnName: 'id'})
  asignaturaTipo: AsignaturaTipo;

  @OneToMany(() => OfertaCurricular, (ofertaCurricular) => ofertaCurricular.planEstudioAsignatura)
  ofertasCurriculares: OfertaCurricular[];

}
