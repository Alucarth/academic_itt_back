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
import { FlujoTipo } from './flujoTipo.entity';
import { Tramite } from './tramite.entity';

@Entity({ name: 'tramite_tipo', schema: 'public' })
export class TramiteTipo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'tramite' })
  tramite: string;

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

  @ManyToOne(() => FlujoTipo, (flujoTipo) => flujoTipo.tramitesTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'flujo_tipo_id', referencedColumnName: 'id'})
  flujoTipo: FlujoTipo;

  @OneToMany(() => Tramite, (tramite) => tramite.tramiteTipo)
  tramites: Tramite[];
  
}
