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
import { EstadoMatriculaTipo } from './estadoMatriculaTipo.entity';
import { EstudianteInscripcionCalificacionGeneral } from './estudianteInscripcionCalificacionGeneral.entity';
import { EstudianteInscripcionOfertaAcademica } from './estudianteInscripcionOfertaAcademica.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { MatriculaTipo } from './matriculaTipo.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'estudiante_inscripcion', schema: 'public' })
export class EstudianteInscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({ type: 'date', name: 'fecha_inscripcion', nullable:true })
  fechaInscripcion: Date | null;

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

  @Column({ type: 'integer', name: 'estudiante_inscripcion_am_id' })
  estudianteInscripcionAmId: number;

  @Column({ name: 'persona_id', nullable:false })
  personaId: number;

  @ManyToOne(() => Persona, (persona) => persona.estudiantesInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  persona: Persona;

  @Column({ name: 'estado_matricula_fin_tipo_id', nullable:false })
  estadoMatriculaFinTipoId: number;

  @ManyToOne(() => EstadoMatriculaTipo, (estadoMatriculaTipo) => estadoMatriculaTipo.estudiantesInscripcionesFin, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_matricula_fin_tipo_id', referencedColumnName: 'id'})
  estadoMatriculaFinTipo: EstadoMatriculaTipo;
  
  @Column({ name: 'institucion_educativa_curso_id' })
  institucionEducativaCursoId: number;
  
  @ManyToOne(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.estudiantesInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_curso_id', referencedColumnName: 'id'})
  institucionEducativaCurso: InstitucionEducativaCurso;

  @Column({ name: 'matricula_tipo_id', nullable:false })
  matriculaTipoId: number;
  @ManyToOne(() => MatriculaTipo, (matriculaTipo) => matriculaTipo.estudiantesInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'matricula_tipo_id', referencedColumnName: 'id'})
  matriculaTipo: MatriculaTipo;

  @Column({ name: 'estado_matricula_inicio_tipo_id', nullable:false })
  estadoMatriculaInicioTipoId: number;
  @ManyToOne(() => EstadoMatriculaTipo, (estadoMatriculaTipo) => estadoMatriculaTipo.estudiantesInscripcionesInicio, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_matricula_inicio_tipo_id', referencedColumnName: 'id'})
  estadoMatriculaInicioTipo: EstadoMatriculaTipo;
  
  @OneToMany(() => EstudianteInscripcionOfertaAcademica, (estudianteInscripcionOfertaAcademica) => estudianteInscripcionOfertaAcademica.estudianteInscripcion)
  estudiantesOfertas: EstudianteInscripcionOfertaAcademica[];

  @OneToMany(() => EstudianteInscripcionCalificacionGeneral, (estudianteInscripcionCalificacionGeneral) => estudianteInscripcionCalificacionGeneral.estudianteInscripcion)
  estudiantesCalificacionesGenerales: EstudianteInscripcionCalificacionGeneral[];

}