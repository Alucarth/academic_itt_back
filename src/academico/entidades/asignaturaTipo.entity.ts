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
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { OfertaAcademica } from './ofertaAcademica.entity';

@Entity({ name: 'asignatura_tipo', schema: 'public' })
export class AsignaturaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'asignatura' })
  asignatura: string;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;
    
  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  
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

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.asignaturaTipo)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];

  @OneToMany(() => OfertaAcademica, (ofertaAcademica) => ofertaAcademica.asignaturaTipo)
  ofertasAcademicas: OfertaAcademica[];

  @OneToMany(() => AsignaturaTipo, (asignaturaTipo) => asignaturaTipo.asignaturaId)
  asignaturaList: AsignaturaTipo[];

  @ManyToOne(() => AsignaturaTipo, (asignaturaTipo) => asignaturaTipo.asignaturaList)
  @JoinColumn({ name: 'asignatura_id', referencedColumnName: 'id'})
  asignaturaId: AsignaturaTipo;
  
}
