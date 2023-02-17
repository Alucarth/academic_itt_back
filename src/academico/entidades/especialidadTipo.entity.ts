import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';

@Entity({ name: 'especialidad_tipo', schema: 'public' })
export class EspecialidadTipo {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', name: 'especialidad' })
  especialidad: string;

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

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidad, (InstitucionEducativaAcreditacionEspecialidad) => InstitucionEducativaAcreditacionEspecialidad.especialidadTipo)
  acreditacionEspecialidades: InstitucionEducativaAcreditacionEspecialidad[];

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.intervaloTiempoTipo)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];
  

}
