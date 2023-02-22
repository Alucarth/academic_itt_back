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
import { EspecialidadTipo } from './especialidadTipo.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';

@Entity({ name: 'institucion_educativa_acreditacion_especialidad', schema: 'public' })
export class InstitucionEducativaAcreditacionEspecialidad {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.acreditacionEspecialidades, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaSucursal: InstitucionEducativaSucursal;

  @ManyToOne(() => EspecialidadTipo, (especialidadTipo) => especialidadTipo.acreditacionEspecialidades, { nullable: false, cascade: true })
  @JoinColumn({ name: 'especialidad_tipo_id', referencedColumnName: 'id'})
  especialidadTipo: EspecialidadTipo;

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidadNivelAcademico, (institucionEducativaAcreditacionEspecialidadNivelAcademico) => institucionEducativaAcreditacionEspecialidadNivelAcademico.institucionEducativaAcreditacionEspecialidad)
  especialidadesNivelesAcademicos: InstitucionEducativaAcreditacionEspecialidadNivelAcademico[];
 
}
