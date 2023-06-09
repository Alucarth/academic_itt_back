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
import { Aula } from './aula.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitutoEstudianteInscripcion } from './InstitutoEstudianteInscripcion.entity';
import { InstitutoPlanEstudioCarrera } from './institutoPlanEstudioCarrera.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { PlanEstudioAsignatura } from './planEstudioAsignatura.entity';

@Entity({ name: 'oferta_curricular', schema: 'public' })
export class OfertaCurricular {

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

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;

  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'integer', name: 'instituto_plan_estudio_carrera_id' })
  institutoPlanEstudioCarreraId: number;

  @ManyToOne(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.ofertasCurriculares, { nullable: false, cascade: true })
  @JoinColumn({ name: 'instituto_plan_estudio_carrera_id', referencedColumnName: 'id'})
  institutoPlanEstudioCarrera: InstitutoPlanEstudioCarrera;

  @Column({ type: 'integer', name: 'gestion_tipo_id' })
  gestionTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.ofertasCurriculares, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;

  @Column({ type: 'integer', name: 'periodo_tipo_id' })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.ofertasCurriculares, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo:PeriodoTipo;

  @Column({ type: 'integer', name: 'plan_estudio_asignatura_id' })
  planEstudioAsignaturaId: number;

  @ManyToOne(() => PlanEstudioAsignatura, (planEstudioAsignatura) => planEstudioAsignatura.ofertasCurriculares, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_asignatura_id', referencedColumnName: 'id'})
  planEstudioAsignatura:PlanEstudioAsignatura;

  @OneToMany(() => Aula, (aula) => aula.ofertaCurricular)
  aulas: Aula[];

  @OneToMany(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.ofertaCurricular)
  institutoEstudianteInscripcions: InstitutoEstudianteInscripcion[];
}

