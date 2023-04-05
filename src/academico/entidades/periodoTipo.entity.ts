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
import { EducacionTipo } from './educacionTipo.entity';
import { EstudianteInscripcionCalificacionGeneral } from './estudianteInscripcionCalificacionGeneral.entity';
import { EstudianteOfertaAcademicaMaestroCalificacion } from './estudianteOfertaAcademicaMaestroCalificacion.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { Operativo } from './operativo.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';

@Entity({ name: 'periodo_tipo', schema: 'public' })
export class PeriodoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'periodo' })
  periodo: string;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;
    
  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

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

  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.periodos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_gestion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @OneToMany(() => Operativo, (operativo) => operativo.periodoTipo)
  operativos: Operativo[];
  
  @OneToMany(() => InstitucionEducativaCurso, (InstitucionEducativaCurso) => InstitucionEducativaCurso.periodoTipo)
  cursos: InstitucionEducativaCurso[];

  @OneToMany(() => EstudianteOfertaAcademicaMaestroCalificacion, (estudianteOfertaAcademicaMaestroCalificacion) => estudianteOfertaAcademicaMaestroCalificacion.periodoTipo)
  estudiantesOfertasMaestrosCalificaciones: EstudianteOfertaAcademicaMaestroCalificacion[];

  @OneToMany(() => OperativoEtapaEducativa, (operativoEtapaEducativa) => operativoEtapaEducativa.periodoTipo)
  operativosEtapas: OperativoEtapaEducativa[];
  
  @OneToMany(() => EstudianteInscripcionCalificacionGeneral, (estudianteInscripcionCalificacionGeneral) => estudianteInscripcionCalificacionGeneral.periodoTipo)
  estudiantesCalificacionesGenerales: EstudianteInscripcionCalificacionGeneral[];

  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.periodoTipo)
  maestrosInscripciones: MaestroInscripcion[];

}
