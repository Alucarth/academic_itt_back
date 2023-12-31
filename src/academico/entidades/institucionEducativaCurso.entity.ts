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
import { EstudianteInscripcion } from './estudianteInscripcion.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';
import { ParaleloTipo } from './paraleloTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { TurnoTipo } from './turnoTipo.entity';

@Entity({ name: 'institucion_educativa_curso', schema: 'public' })
export class InstitucionEducativaCurso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'institucion_educativa_curso_am_id' })
  institucionEducativaCursoAmId: number;

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

  @Column({ name: 'institucion_educativa_sucursal_id', nullable:false })
  institucionEducativaSucursalId: number;

  @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaSucursal: InstitucionEducativaSucursal;
  
  @Column({ name: 'gestion_tipo_id', nullable:false })
  gestionTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;
  
  @Column({ name: 'turno_tipo_id', nullable:false })
  turnoTipoId: number;

  @ManyToOne(() => TurnoTipo, (turnoTipo) => turnoTipo.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'turno_tipo_id', referencedColumnName: 'id'})
  turnoTipo: TurnoTipo;
  
  @Column({ name: 'paralelo_tipo_id', nullable:false })
  paraleloTipoId: number;

  @ManyToOne(() => ParaleloTipo, (paraleloTipo) => paraleloTipo.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'paralelo_tipo_id', referencedColumnName: 'id'})
  paraleloTipo: ParaleloTipo;

  @Column({ name: 'etapa_educativa_id', nullable:false })
  etapaEducativaId: number;

  @ManyToOne(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'etapa_educativa_id', referencedColumnName: 'id'})
  etapaEducativa: EtapaEducativa;
  
  @Column({ name: 'periodo_tipo_id', nullable:false })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.cursos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;


  @OneToMany(() => OfertaAcademica, (ofertaAcademica) => ofertaAcademica.institucionEducativaCurso)
  ofertasAcademicas: OfertaAcademica[];
  
  @OneToMany(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.institucionEducativaCurso)
  estudiantesInscripciones: EstudianteInscripcion[];    

}
