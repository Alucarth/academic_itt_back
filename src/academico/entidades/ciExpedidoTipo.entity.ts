import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Persona } from './persona.entity';

@Entity({ name: 'ci_expedido_tipo', schema: 'public' })
export class CiExpedidoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'sigla' })
  sigla: string;

  @Column({ type: 'varchar', name: 'departamento' })
  departamento: string;

  @Column({ type: 'varchar', name: 'obs' })
  obs: string;

  @Column({ type: 'varchar', name: 'codigo' })
  codigo: string;
  
  @OneToMany(() => Persona, (persona) => persona.ciExpedidoTipo)
  personas: Persona[];
}
