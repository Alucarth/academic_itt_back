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
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';

@Entity({ name: 'institucion_educativa_acreditacion_especialidad_nivel_intervalo', schema: 'public' })
export class InstitucionEducativaAcreditacionEspecialidadNivelIntervalo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'integer', name: 'tiempo' })
  tiempo: number;
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

  
  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.especialidadesNivelesIntervalos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_gestion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @ManyToOne(() => InstitucionEducativaAcreditacionEspecialidadNivelAcademico, (institucionEducativaAcreditacionEspecialidadNivelAcademico) => institucionEducativaAcreditacionEspecialidadNivelAcademico.especialidadesNivelesIntervalos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_acreditacion_especialidad_nivel_id', referencedColumnName: 'id'})
  institucionEducativaAcreditacionEspecialidadNivel: InstitucionEducativaAcreditacionEspecialidadNivelAcademico;

}
