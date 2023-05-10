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
import { CarreraGrupoTipo } from './carreraGrupoTipo.entity';
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

  //no existe esta columna
  /*@Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;*/

  @OneToMany(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.carreraTipo)
  carreras: CarreraAutorizada[];

  @Column({ name: 'carrera_grupo_tipo_id', nullable:false })
  carreraGrupoTipoId: number;

  @ManyToOne(() => CarreraGrupoTipo, (carreraGrupoTipo) => carreraGrupoTipo.carrerasTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_grupo_tipo_id', referencedColumnName: 'id'})
  carreraGrupoTipo: CarreraGrupoTipo;

  
}
