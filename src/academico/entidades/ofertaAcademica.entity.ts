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
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { OfertaAcademicaMaestroInscripcion } from './ofertaAcademicaMaestroInscripcion.entity';

@Entity({ name: 'oferta_academica', schema: 'public' })
export class OfertaAcademica {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'opcional', type: 'bool', default: true , nullable:true})
  opcional: boolean;

  @Column({ type: 'integer', name: 'institucioneducativa_curso_oferta_am_id', nullable: true })
  institucioneducativaCursoOfertaAmId: number;

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
  
  @ManyToOne(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.ofertasAcademicas, { nullable: false, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institucion_educativa_curso_id', referencedColumnName: 'id'})
  institucionEducativaCurso: InstitucionEducativaCurso;
  
  @OneToMany(() => EstudianteInscripcionOfertaAcademica, (estudianteInscripcionOfertaAcademica) => estudianteInscripcionOfertaAcademica.ofertaAcademica)
  estudiantesOfertas: EstudianteInscripcionOfertaAcademica[];
 
  @OneToMany(() => OfertaAcademicaMaestroInscripcion , (ofertaAcademicaMaestroInscripcion) => ofertaAcademicaMaestroInscripcion.ofertaAcademica)
  ofertasAcademicasMaestrosInscripciones: OfertaAcademicaMaestroInscripcion[];
}
