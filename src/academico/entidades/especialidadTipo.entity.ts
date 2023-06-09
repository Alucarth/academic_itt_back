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
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';

@Entity({ name: 'especialidad_tipo', schema: 'public' })
export class EspecialidadTipo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', name: 'especialidad' })
  especialidad: string;

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

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidad, (InstitucionEducativaAcreditacionEspecialidad) => InstitucionEducativaAcreditacionEspecialidad.especialidadTipo)
  acreditacionEspecialidades: InstitucionEducativaAcreditacionEspecialidad[];

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.intervaloTiempoTipo)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];
  
  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.especialidadTipo)
  maestrosInscripciones: MaestroInscripcion[];
 
  @OneToMany(() => EspecialidadTipo, (especialidadTipo) => especialidadTipo.especialidadId)
  especialidadList: EspecialidadTipo[];

  @ManyToOne(() => EspecialidadTipo, (especialidadTipo) => especialidadTipo.especialidadList)
  @JoinColumn({ name: 'especialidad_id', referencedColumnName: 'id'})
  especialidadId: EspecialidadTipo;
}
