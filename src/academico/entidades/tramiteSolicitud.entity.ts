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
import { FlujoTipo } from './flujoTipo.entity';
import { Tarea } from './tarea.entity';
import { Tramite } from './tramite.entity';
import { TramiteTarea } from './tramiteTarea.entity';

@Entity({ name: 'tramite_solicitud', schema: 'public' })
export class TramiteSolicitud {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'datos' })
  datos: string;

  @Column({name:'valido', type: 'bool', default: true })
  valido: boolean;

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
  
  @Column({ type: 'integer', name: 'distrito_unidad_territorial_id' })
  distritoUnidadTerritorialId: number;

  @Column({ type: 'integer', name: 'localidad_unidad_territorial_id' })
  localidadUnidadTerritorialId: number;

  @Column({ type: 'integer', name: 'destinatario_usuario_id' })
  destinatarioUsuarioId: number;

  @ManyToOne(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tramitesTareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'tramite_tarea_id', referencedColumnName: 'id'})
  tramiteTarea: TramiteTarea;

}
