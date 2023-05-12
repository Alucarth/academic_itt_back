import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanEstudioAsignatura } from './planEstudioAsignatura.entity';

@Entity({ name: 'regimen_grado_tipo', schema: 'public' })
export class RegimenGradoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'regimen_grado' })
  regimenGrado: string;
  
  @Column({ type: 'varchar', name: 'sigla' })
  sigla: string;

  @Column({ type: 'boolean', name: 'activo' })
  activo: boolean;
  
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

  @OneToMany(() => PlanEstudioAsignatura, (planEstudioAsignatura) => planEstudioAsignatura.regimenGradoTipo)
  planesAsignaturas: PlanEstudioAsignatura[];
}
