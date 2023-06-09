import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AulaDocente } from './aulaDocente.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { InstitutoEstudianteInscripcion } from './InstitutoEstudianteInscripcion.entity';
import { ModalidadEvaluacionTipo } from './modalidadEvaluacionTipo.entity';
import { NotaTipo } from './notaTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { ValoracionTipo } from './valoracionTipo.entity';

@Entity({ name: 'instituto_estudiante_inscripcion_docente_calificacion', schema: 'public' })
export class InstitutoEstudianteInscripcionDocenteCalificacion {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'integer', name: 'cuantitativa' })
  cuantitativa: number;

  @Column({ type: 'varchar', name: 'cualitativa' })
  cualitativa: string;

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

  @Column({ type: 'integer', name: 'instituto_estudiante_inscripcion_id' })
  institutoEstudianteInscripcionId: number;

  @ManyToOne(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'instituto_estudiante_inscripcion_id', referencedColumnName: 'id'})
  institutoEstudianteInscripcion: InstitutoEstudianteInscripcion;

  @Column({ type: 'integer', name: 'aula_docente_id' })
  aulaDocenteId: number;

  @ManyToOne(() => AulaDocente, (aulaDocente) => aulaDocente.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'aula_docente_id', referencedColumnName: 'id'})
  aulaDocente: AulaDocente;

  @Column({ type: 'integer', name: 'periodo_tipo_id' })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;

  @Column({ type: 'integer', name: 'valoracion_tipo_id' })
  valoracionTipoId: number;

  @ManyToOne(() => ValoracionTipo, (valoracionTipo) => valoracionTipo.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'valoracion_tipo_id', referencedColumnName: 'id'})
  valoracionTipo: ValoracionTipo;

  @Column({ type: 'integer', name: 'nota_tipo_id' })
  notaTipoId: number;

  @ManyToOne(() => NotaTipo, (notaTipo) => notaTipo.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nota_tipo_id', referencedColumnName: 'id'})
  notaTipo: NotaTipo;

  @Column({ type: 'integer', name: 'modalidad_evaluacion_tipo_id' })
  modalidadEvaluacionTipoId: number;

  @ManyToOne(() => ModalidadEvaluacionTipo, (modalidadEvaluacionTipo) => modalidadEvaluacionTipo.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'modalidad_evaluacion_tipo_id', referencedColumnName: 'id'})
  modalidadEvaluacionTipo: ModalidadEvaluacionTipo;
  
}