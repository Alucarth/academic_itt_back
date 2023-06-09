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
import { Tarea } from './tarea.entity';

@Entity({ name: 'intervalo_tiempo_tipo', schema: 'public' })
export class IntervaloTiempoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'intervalo_tiempo' })
  intervaloTiempo: string;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;
 
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

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.intervaloTiempoTipo)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];

  @OneToMany(() => Tarea, (tarea) => tarea.intervaloTiempoTipo)
  tareas: Tarea[];
  
}
