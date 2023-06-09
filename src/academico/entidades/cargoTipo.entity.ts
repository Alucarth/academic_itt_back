import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaestroInscripcion } from './maestroInscripcion.entity';

@Entity({ name: 'cargo_tipo', schema: 'public' })
export class CargoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'cargo' })
  cargo: string;

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
  
  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.cargoTipo)
  maestrosInscripciones: MaestroInscripcion[];

}
