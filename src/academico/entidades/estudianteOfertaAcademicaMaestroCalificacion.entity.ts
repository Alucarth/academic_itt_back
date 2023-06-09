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
import { EstudianteInscripcionOfertaAcademica } from './estudianteInscripcionOfertaAcademica.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';
import { OfertaAcademicaMaestroInscripcion } from './ofertaAcademicaMaestroInscripcion.entity';
import { PeriodoTipo } from './periodoTipo.entity';

@Entity({ name: 'estudiante_oferta_academica_maestro_calificacion', schema: 'public' })
export class EstudianteOfertaAcademicaMaestroCalificacion {

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

  @Column({ type: 'integer', name: 'valoracion_estado_id' })
  valoracionEstadoId: number;


  @Column({ name: 'periodo_tipo_id', nullable:false })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.estudiantesOfertasMaestrosCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;


  @Column({ name: 'estudiante_inscripcion_oferta_academica_id', nullable:false })
  estudianteInscripcionOfertaAcademicaId: number;

  @ManyToOne(() => EstudianteInscripcionOfertaAcademica, (estudianteInscripcionOfertaAcademica) => estudianteInscripcionOfertaAcademica.estudiantesOfertasMaestrosCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estudiante_inscripcion_oferta_academica_id', referencedColumnName: 'id'})
  estudianteInscripcionOfertaAcademica: EstudianteInscripcionOfertaAcademica;


  @Column({ name: 'oferta_academica_maestro_inscripcion_id', nullable:false })
  ofertaAcademicaMaestroInscripcionId: number;

  @ManyToOne(() => OfertaAcademicaMaestroInscripcion, (OfertaAcademicaMaestroInscripcion) => OfertaAcademicaMaestroInscripcion.estudiantesOfertasMaestrosCalificaciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'oferta_academica_maestro_inscripcion_id', referencedColumnName: 'id'})
  ofertaAcademicaMaestroInscripcion: OfertaAcademicaMaestroInscripcion;

  
}
