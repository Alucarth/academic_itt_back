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
import { EstudianteOfertaAcademicaMaestroCalificacion } from './estudianteOfertaAcademicaMaestroCalificacion.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';

@Entity({ name: 'oferta_academica_maestro_inscripcion', schema: 'public' })
export class OfertaAcademicaMaestroInscripcion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'asignacion_fecha_inicio' })
  asignacionFechaInicio: string;

  @Column({ type: 'date', name: 'asignacion_fecha_fin' })
  asignacionFechaFin: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

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

  @Column({ name: 'maestro_incripcion_id', nullable:false })
  maestroInscripcionId: number;

  @ManyToOne(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.ofertasAcademicasMaestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'maestro_incripcion_id', referencedColumnName: 'id'})
  maestroInscripcion: MaestroInscripcion;
  
  @Column({ name: 'oferta_academica_id', nullable:false })
  ofertaAcademicaId: number;

  @ManyToOne(() => OfertaAcademica, (ofertaAcademica) => ofertaAcademica.ofertasAcademicasMaestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'oferta_academica_id', referencedColumnName: 'id'})
  ofertaAcademica: OfertaAcademica;
 
  @OneToMany(() => EstudianteOfertaAcademicaMaestroCalificacion, (estudianteOfertaAcademicaMaestroCalificacion) => estudianteOfertaAcademicaMaestroCalificacion.ofertaAcademicaMaestroInscripcion)
  estudiantesOfertasMaestrosCalificaciones: EstudianteOfertaAcademicaMaestroCalificacion[];
  
  
}
