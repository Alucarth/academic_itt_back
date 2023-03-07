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
import { EstudianteInscripcionOfertaAcademica } from './estudianteInscripcionOfertaAcademica.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { TurnoTipo } from './turnoTipo.entity';

@Entity({ name: 'oferta_academica', schema: 'public' })
export class OfertaAcademica {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'opcional', type: 'bool', default: true })
  opcional: boolean;

  @Column({ type: 'integer', name: 'institucion_educativa_curso_oferta_am_id' })
  institucionEducativaCursoOfertaAmId: number;

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

  @ManyToOne(() => AsignaturaTipo, (asignaturaTipo) => asignaturaTipo.ofertasAcademicas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'asignatura_tipo_id', referencedColumnName: 'id'})
  asignaturaTipo: AsignaturaTipo;
  
  @ManyToOne(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.ofertasAcademicas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaCurso: InstitucionEducativaCurso;
  
  @OneToMany(() => EstudianteInscripcionOfertaAcademica, (estudianteInscripcionOfertaAcademica) => estudianteInscripcionOfertaAcademica.ofertaAcademica)
  estudiantesOfertas: EstudianteInscripcionOfertaAcademica[];
  
}
