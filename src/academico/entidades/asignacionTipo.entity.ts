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
import { OfertaAcademica } from './ofertaAcademica.entity';
import { PlanEstudioAsignatura } from './planEstudioAsignatura.entity';
import { Tarea } from './tarea.entity';

@Entity({ name: 'asignacion_tipo', schema: 'public' })
export class AsignacionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'asignacion' })
  asignacion: string;
  
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

  @OneToMany(() => Tarea, (tarea) => tarea.asignacionTipo)
  tareas: Tarea[];


}
