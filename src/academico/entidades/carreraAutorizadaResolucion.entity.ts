import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { NivelAcademicoTipo } from './nivelAcademicoTipo.entity';
import { ResolucionTipo } from './resolucionTipo.entity';

@Entity({ name: 'carrera_autorizada_resolucion', schema: 'public' })
export class CarreraAutorizadaResolucion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'descripcion' })
  descripcion: string;

  @Column({ type: 'varchar', name: 'numero_resolucion' })
  numeroResolucion: string;

  @Column({ type: 'varchar', name: 'path' })
  path: string;

  @Column({ type: 'varchar', name: 'fecha_resolucion' })
  fechaResolucion: string;

  @Column({ type: 'varchar', name: 'resuelve' })
  resuelve: string;

  @Column({ type: 'integer', name: 'tiempo_estudio' })
  tiempoEstudio: number;

  @Column({ type: 'integer', name: 'carga_horaria' })
  cargaHoraria: number;

  @Column({ type: 'varchar', name: 'operacion' })
  operacion: string;
  
  @Column({ type: 'boolean', name: 'ultimo' })
  ultimo: boolean;

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
  
  @Column({ name: 'carrera_autorizada_id', nullable:false })
  carreraAutorizadaId: number;

  @ManyToOne(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.resoluciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_autorizada_id', referencedColumnName: 'id'})
  carreraAutorizada: CarreraAutorizada;

  @Column({ name: 'nivel_academico_tipo_id', nullable:false })
  nivelAcademicoTipoId: number;

  @ManyToOne(() => NivelAcademicoTipo, (nivelAcademicoTipo) => nivelAcademicoTipo.resoluciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nivel_academico_tipo_id', referencedColumnName: 'id'})
  nivelAcademicoTipo: NivelAcademicoTipo;

  @Column({ name: 'intervalo_gestion_tipo_id', nullable:false })
  intervaloGestionTipoId: number;

  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.resoluciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_gestion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;
  
  @Column({ name: 'resolucion_tipo_id', nullable:false })
  resolucionTipoId: number;

  @ManyToOne(() => ResolucionTipo, (resolucionTipo) => resolucionTipo.resoluciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'resolucion_tipo_id', referencedColumnName: 'id'})
  resolucionTipo: ResolucionTipo;

  @DeleteDateColumn()  //soft delete
  deleted_at: Date; // Deletion date 
}
