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
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelIntervalo } from './institucionEducativaAcreditacionEspecialidadNivelIntervalo.entity';
import { NivelAcademicoTipo } from './nivelAcademicoTipo.entity';

@Entity({ name: 'institucion_educativa_acreditacion_especialidad_nivel_academico', schema: 'public' })
export class InstitucionEducativaAcreditacionEspecialidadNivelAcademico {
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

  @ManyToOne(() => NivelAcademicoTipo, (nivelAcademicoTipo) => nivelAcademicoTipo.especialidadesNivelesAcademicos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nivel_academico_tipo_id', referencedColumnName: 'id'})
  nivelAcademicoTipo: NivelAcademicoTipo;

  @ManyToOne(() => InstitucionEducativaAcreditacionEspecialidad, (institucionEducativaAcreditacionEspecialidad) => institucionEducativaAcreditacionEspecialidad.especialidadesNivelesAcademicos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_acreditacion_especialidad_id', referencedColumnName: 'id'})
  institucionEducativaAcreditacionEspecialidad: InstitucionEducativaAcreditacionEspecialidad;

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidadNivelIntervalo, (institucionEducativaAcreditacionEspecialidadNivelIntervalo) => institucionEducativaAcreditacionEspecialidadNivelIntervalo.intervaloGestionTipo)
  especialidadesNivelesIntervalos: InstitucionEducativaAcreditacionEspecialidadNivelIntervalo[];
  

}
