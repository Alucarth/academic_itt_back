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
import { EducacionTipo } from './educacion_tipo.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucion_educativa_acreditacion_especialidad.entity';
import { JurisdiccionGeografica } from './jurisdiccion-geografica.entity';

@Entity({ name: 'institucion_educativa', schema: 'public' })
export class InstitucionEducativa {
  @PrimaryGeneratedColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1

  @Column({ type: 'varchar', name: 'institucion_educativa' })
  instutucionEducativa: string;

  //educacion_tipo_id * a 1
  @Column({ type: 'date', name: 'fecha_fundacion' })
  fechaFundacion: Date;

  @Column({ type: 'date', name: 'fecha_cierre' })
  fechaCierre: Date;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

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
  uduarioId: number;

  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.instituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;

  @ManyToOne(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.instituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'jurisdiccion_geografica_id', referencedColumnName: 'id'})
  jurisdiccionGeografica: JurisdiccionGeografica;

  
  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidad, (InstitucionEducativaAcreditacionEspecialidad) => InstitucionEducativaAcreditacionEspecialidad.institucionEducativa)
  acreditacionEspecialidades: InstitucionEducativaAcreditacionEspecialidad[];
}
