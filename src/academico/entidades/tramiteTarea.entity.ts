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

@Entity({ name: 'tramite_tarea', schema: 'public' })
export class TramiteTarea {

  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'integer', name: 'remitente_usuario_id' })
  remitenteUsuarioId: number;

  @Column({ type: 'integer', name: 'destinatario_usuario_id' })
  destinatarioUsuarioId: number;

  @ManyToOne(() => Tramite, (tramite) => tramite.tramitesTareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'tramite_id', referencedColumnName: 'id'})
  tramite: Tramite;

  @ManyToOne(() => Tarea, (tarea) => tarea.tramitesTareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'tarea_id', referencedColumnName: 'id'})
  tarea: Tarea;

  @ManyToOne(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tramitesTareasLista, { nullable: true, cascade: true })
  @JoinColumn({ name: 'tramite_tarea_id', referencedColumnName: 'id'})
  tramiteTarea: TramiteTarea;

  @OneToMany(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tramiteTarea)
  tramitesTareasLista: TramiteTarea[];

  @OneToMany(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tramiteTarea)
  tramitesTareas: TramiteTarea[];

  
}
