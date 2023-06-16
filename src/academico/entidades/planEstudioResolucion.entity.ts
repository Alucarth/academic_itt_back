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
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';

@Entity({ name: 'plan_estudio_resolucion', schema: 'public' })
export class PlanEstudioResolucion {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'numero_resolucion' })
  numeroResolucion: string;

  @Column({ type: 'date', name: 'fecha_resolucion' })
  fechaResolucion: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
    
  @Column({ type: 'varchar', name: 'descripcion' })
  descripcion: string;

  
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

  @OneToMany(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.planEstudioResolucion, { cascade: true })
  planesCarreras: PlanEstudioCarrera[];

}
