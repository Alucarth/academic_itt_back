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
import { EventoTipo } from './eventoTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { PeriodoTipo } from './periodoTipo.entity';

@Entity({ name: 'operativo', schema: 'public' })
export class Operativo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'fecha_inicio', type: 'date'})
  fechaInicio: Date;

  @Column({name:'fecha_fin', type: 'date'})
  fechaFin: Date;

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

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.operativos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;
  
  @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.operativos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaSucursal: InstitucionEducativaSucursal;

  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.operativos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;
  
  @ManyToOne(() => EventoTipo, (eventoTipo) => eventoTipo.operativos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'evento_tipo_id', referencedColumnName: 'id'})
  eventoTipo: EventoTipo;
  
  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.operativos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;
  
}
