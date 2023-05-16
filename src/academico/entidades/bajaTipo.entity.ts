import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AulaDocente } from './aulaDocente.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';

@Entity({ name: 'baja_tipo', schema: 'public' })
export class BajaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'baja' })
  baja: string;

  @Column({ type: 'boolean', name: 'activo' })
  activo: boolean;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;
  
 
  @OneToMany(() => AulaDocente, (aulaDocente) => aulaDocente.bajaTipo)
  aulasDocentes: AulaDocente[];
}
