import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';
import { Tarea } from './tarea.entity';

@Entity({ name: 'area_tipo', schema: 'public' })
export class AreaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'area' })
  area: string;
  
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

  @OneToMany(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.areaTipo)
  carreras: CarreraAutorizada[];

  @OneToMany(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.areaTipo)
  planesCarreras: PlanEstudioCarrera[];
  
}
