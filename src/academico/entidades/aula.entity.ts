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
import { AulaDetalle } from './aulaDetalle.entity';
import { AulaDocente } from './aulaDocente.entity';
import { DiaTipo } from './diaTipo.entity';
import { InstitutoEstudianteInscripcion } from './InstitutoEstudianteInscripcion.entity';
import { OfertaCurricular } from './ofertaCurricular.entity';
import { ParaleloTipo } from './paraleloTipo.entity';

@Entity({ name: 'aula', schema: 'public' })
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'cupo' })
  cupo: string;

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
 
  /*@Column({ type: 'integer', name: 'dia_tipo_id' })
  diaTipoId: number;

  @ManyToOne(() => DiaTipo, (diaTipo) => diaTipo.aulasDetalles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'dia_tipo_id', referencedColumnName: 'id'})
  diaTipo: DiaTipo;*/

  @Column({ type: 'integer', name: 'oferta_curricular_id' })
  ofertaCurricularId: number;

  @ManyToOne(() => OfertaCurricular, (ofertaCurricular) => ofertaCurricular.aulas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'oferta_curricular_id', referencedColumnName: 'id'})
  ofertaCurricular:OfertaCurricular;

  @OneToMany(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.aula)
  institutoEstudianteInscripcions: InstitutoEstudianteInscripcion[];

  @OneToMany(() => AulaDetalle, (aulaDetalle) => aulaDetalle.aula)
  aulasDetalles: AulaDetalle[];

  @OneToMany(() => AulaDocente, (aulaDocente) => aulaDocente.aula)
  aulasDocentes: AulaDocente[];

  @Column({ type: 'integer', name: 'paralelo_tipo_id' })
  paraleloTipoId: number;

  @ManyToOne(() => ParaleloTipo, (paraleloTipo) => paraleloTipo.aulas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'paralelo_tipo_id', referencedColumnName: 'id'})
  paraleloTipo: ParaleloTipo;

}
