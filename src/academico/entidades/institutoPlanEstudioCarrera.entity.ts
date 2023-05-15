import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';

@Entity({ name: 'instituto_plan_estudio_carrera', schema: 'public' })
export class InstitutoPlanEstudioCarrera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({name:'activo', type: 'bool', default: true })
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

  @Column({ name: 'carrera_autorizada_id', nullable:false })
  carreraAutorizadaId: number;

  @ManyToOne(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.institutosPlanesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_autorizada_id', referencedColumnName: 'id'})
  carreraAutorizada: CarreraAutorizada;

  @Column({ type: 'integer', name: 'plan_estudio_carrera_id' })
  planEstudioCarreraId: number;

  @ManyToOne(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.institutosPlanesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_carrera_id', referencedColumnName: 'id'})
  planEstudioCarrera: PlanEstudioCarrera;
  
}
