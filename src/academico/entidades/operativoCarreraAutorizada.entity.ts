import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { EventoTipo } from './eventoTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { ModalidadEvaluacionTipo } from './modalidadEvaluacionTipo.entity';
import { NotaTipo } from './notaTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';

@Entity({ name: 'operativo_carrera_autorizada', schema: 'public' })
export class OperativoCarreraAutorizada {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'fecha_inicio', type: 'date'})
  fechaInicio: String;

  @Column({name:'fecha_fin', type: 'date'})
  fechaFin: String;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

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

  @Column({ name: 'gestion_tipo_id', nullable:false })
  gestionTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;
  
  @Column({ name: 'evento_tipo_id', nullable:false })
  eventoTipoId: number;

  @ManyToOne(() => EventoTipo, (eventoTipo) => eventoTipo.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'evento_tipo_id', referencedColumnName: 'id'})
  eventoTipo: EventoTipo;
  
  @Column({ name: 'periodo_tipo_id', nullable:false })
  periodoTipoId: number;

  @ManyToOne(() => PeriodoTipo, (PeriodoTipo) => PeriodoTipo.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;

  @Column({ name: 'carrera_autorizada_id', nullable:false })
  carreraAutorizadaId: number;

  @ManyToOne(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.operativosCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_autorizada_id', referencedColumnName: 'id'})
  carreraAutorizada: CarreraAutorizada;

  @Column({ name: 'modalidad_evaluacion_tipo_id', nullable:false })
  modalidadEvaluacionTipoId: number;

  @ManyToOne(() => ModalidadEvaluacionTipo, (modalidadEvaluacionTipo) => modalidadEvaluacionTipo.operativosCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'modalidad_evaluacion_tipo_id', referencedColumnName: 'id'})
  modalidadEvaluacionTipo: ModalidadEvaluacionTipo;

 
}
