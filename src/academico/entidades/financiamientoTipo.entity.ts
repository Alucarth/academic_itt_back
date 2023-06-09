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
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';

@Entity({ name: 'financiamiento_tipo', schema: 'public' })
export class FinanciamientoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'financiamiento' })
  financiamiento: string;

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

  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.financiamientoTipo)
  maestrosInscripciones: MaestroInscripcion[];
  
}
