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
import { EstudianteInscripcion } from './estudianteInscripcion.entity';
import { EstudianteInscripcionOfertaAcademica } from './estudianteInscripcionOfertaAcademica.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { MatriculaTipo } from './matriculaTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'estudiante_inscripcion_calificacion_general', schema: 'public' })
export class EstudianteInscripcionCalificacionGeneral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'cuantitativa' })
  cuantitativa: number;

  @Column({ type: 'varchar', name: 'cualitativa' })
  cualitativa: string;

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

  @Column({ name: 'periodo_tipo_id', nullable:false })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.estudiantesCalificacionesGenerales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;

  
  @Column({ name: 'estudiante_inscripcion_id', nullable:false })
  estudianteInscripcionId: number;

  @ManyToOne(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.estudiantesCalificacionesGenerales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estudiante_inscripcion_id', referencedColumnName: 'id'})
  estudianteInscripcion: EstudianteInscripcion;
  

}