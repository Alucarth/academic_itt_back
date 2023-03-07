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
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { MatriculaTipo } from './matriculaTipo.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'estudiante_inscripcion_oferta_academica', schema: 'public' })
export class EstudianteInscripcionOfertaAcademica {
  @PrimaryGeneratedColumn()
  id: number;
  
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

  @Column({ type: 'integer', name: 'estudiante_asignatura_ma_id' })
  estudianteAsignaturaMaId: number;
  

  @ManyToOne(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.estudiantesOfertas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estudiante_inscripcion_id', referencedColumnName: 'id'})
  estudianteInscripcion: EstudianteInscripcion;

  @ManyToOne(() => OfertaAcademica, (ofertaAcademica) => ofertaAcademica.estudiantesOfertas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'oferta_academica_id', referencedColumnName: 'id'})
  ofertaAcademica: OfertaAcademica;

  
}