import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tarea } from './tarea.entity';
import { TramiteTipo } from './tramiteTipo.entity';

@Entity({ name: 'flujo_tipo', schema: 'public' })
export class FlujoTipo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'flujo' })
  flujo: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

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

  @OneToMany(() => TramiteTipo, (tramiteTipo) => tramiteTipo.flujoTipo)
  tramitesTipos: TramiteTipo[];
  
  @OneToMany(() => Tarea, (tarea) => tarea.flujoTipo)
  tareas: Tarea[];
}
