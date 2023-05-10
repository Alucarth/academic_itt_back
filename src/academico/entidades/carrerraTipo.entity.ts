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
import { Tarea } from './tarea.entity';

@Entity({ name: 'carrera_tipo', schema: 'public' })
export class CarreraTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'carrera' })
  carrera: string;
  
 
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

  /*@Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;*/

  carreraGrupoTipoId: number;

  //TODO: crear la relacion
  /*@OneToMany(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.carreraTipo)
  carreras: CarreraAutorizada[];*/
  
}
