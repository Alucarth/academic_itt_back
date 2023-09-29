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
import { AreaTipo } from './areaTipo.entity';
import { CarreraTipo } from './carrerraTipo.entity';
import { InstitutoPlanEstudioCarrera } from './institutoPlanEstudioCarrera.entity';

import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { MatriculaEstudiante } from './matriculaEstudiante.entity';
import { NivelAcademicoTipo } from './nivelAcademicoTipo.entity';
import { PlanEstudioAsignatura } from './planEstudioAsignatura.entity';
import { PlanEstudioResolucion } from './planEstudioResolucion.entity';
import { PlanEstudioCarreraSeguimiento } from './planEstudioCarreraSeguimiento.entity';
import { EstadoInstituto } from './estadoInstituto.entity';

@Entity({ name: 'plan_estudio_carrera', schema: 'public' })
export class PlanEstudioCarrera {

  @PrimaryGeneratedColumn()
  id: number;


  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
  
  @Column({name:'aprobado', type: 'bool', default: true })
  aprobado: boolean;
  
  @Column({ type: 'varchar', name: 'descripcion' })
  descripcion: string;

  @Column({ type: 'varchar', name: 'denominacion' })
  denominacion: string;

  
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

  @Column({ name: 'carrera_tipo_id', nullable:false })
  carreraTipoId: number;

  @ManyToOne(() => CarreraTipo, (carreraTipo) => carreraTipo.planesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_tipo_id', referencedColumnName: 'id'})
  carreraTipo: CarreraTipo;

  @Column({ name: 'area_tipo_id', nullable:false })
  areaTipoId: number;

  @ManyToOne(() => AreaTipo, (areaTipo) => areaTipo.planesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'area_tipo_id', referencedColumnName: 'id'})
  areaTipo: AreaTipo;

  @Column({ name: 'nivel_academico_tipo_id', nullable:false })
  nivelAcademicoTipoId: number;

  @Column({ type: 'integer', name: 'tiempo_estudio' })
  tiempoEstudio: number;

  @Column({ type: 'integer', name: 'carga_horaria' })
  cargaHoraria: number;

  
  @ManyToOne(() => NivelAcademicoTipo, (nivelAcademicoTipo) => nivelAcademicoTipo.planesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nivel_academico_tipo_id', referencedColumnName: 'id'})
  nivelAcademicoTipo: NivelAcademicoTipo;

  @Column({ name: 'intervalo_gestion_tipo_id', nullable:false })
  intervaloGestionTipoId: number;

  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.planesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_gestion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @Column({ type: 'integer', name: 'plan_estudio_resolucion_id' })
  planEstudioResolucionId: number;

  @ManyToOne(() => PlanEstudioResolucion, (planEstudioResolucion) => planEstudioResolucion.planesCarreras, { nullable: false, eager: true })
  @JoinColumn({ name: 'plan_estudio_resolucion_id', referencedColumnName: 'id'})
  planEstudioResolucion: PlanEstudioResolucion;

  @OneToMany(() => PlanEstudioAsignatura, (planEstudioAsignatura) => planEstudioAsignatura.planEstudioCarrera, { cascade: true })
  planesAsignaturas: PlanEstudioAsignatura[];

  @OneToMany(() => PlanEstudioCarreraSeguimiento, (planEstudioCarreraSeguimiento) => planEstudioCarreraSeguimiento.planEstudioCarrera, { cascade: true })
  planesSeguimientos: PlanEstudioCarreraSeguimiento[];

  @OneToMany(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.planEstudioCarrera, { cascade: true })
  institutosPlanesCarreras: InstitutoPlanEstudioCarrera[];

  @OneToMany(() => MatriculaEstudiante, (matriculaEstudiante) => matriculaEstudiante.planEstudioCarrera)
  matriculaEstudiantes: MatriculaEstudiante[];
  
  @Column({ name: 'estado_instituto_id', nullable:false })
  estadoInstitutoId: number;

  @ManyToOne(() => EstadoInstituto, (estadoInstituto) => estadoInstituto.planesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_instituto_id', referencedColumnName: 'id'})
  estadoInstituto: EstadoInstituto;

}