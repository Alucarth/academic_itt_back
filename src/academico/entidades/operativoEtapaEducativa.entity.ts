import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EducacionTipo } from './educacionTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { EventoTipo } from './eventoTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { PeriodoTipo } from './periodoTipo.entity';

@Entity({ name: 'operativo_etapa_educativa', schema: 'public' })
export class OperativoEtapaEducativa {
  getAll(): OperativoEtapaEducativa[] | PromiseLike<OperativoEtapaEducativa[]> {
      throw new Error('Method not implemented.');
  }

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

  @Column({ name: 'gestion_tipo_id', nullable:false })
  gestionTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;
  
  @Column({ name: 'educacion_tipo_id', nullable:false })
  educacionTipoId: number;
  
  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;
  
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

  @Column({ name: 'etapa_educativa_id', nullable:false })
  etapaEducativaId: number;

  @ManyToOne(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.operativosEtapas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'etapa_educativa_id', referencedColumnName: 'id'})
  etapaEducativa: EtapaEducativa;

  
}
