import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EducacionTipo } from './educacionTipo.entity';
import { EstadoInstitucionEductivaTipo } from './estadoInstitucionEducativaTipo.entity';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';
import { TramiteInstitucionEducativa } from './tramiteInstitucionEducativa.entity';

@Entity({ name: 'institucion_educativa', schema: 'public' })
export class InstitucionEducativa {
  @PrimaryColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1

  @Column({ type: 'varchar', name: 'institucion_educativa' })
  institucionEducativa: string;

  //educacion_tipo_id * a 1
  @Column({ type: 'date', name: 'fecha_fundacion' })
  fechaFundacion: String;

  @Column({ type: 'date', name: 'fecha_cierre' })
  fechaCierre: String;

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

  @Column({ type: 'integer', name: 'educacion_tipo_id' })
  educacionTipoId: number;

  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.instituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;


  @Column({ type: 'integer', name: 'estado_institucion_educativa_tipo_id' })
  estadoInstitucionEducativaTipoId: number;


  @ManyToOne(() => EstadoInstitucionEductivaTipo, (estadoInstitucionEducativaTipo) => estadoInstitucionEducativaTipo.instituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_institucion_educativa_tipo_id', referencedColumnName: 'id'})
  estadoInstitucionEducativaTipo: EstadoInstitucionEductivaTipo;

  @Column({ type: 'integer', name: 'jurisdiccion_geografica_id' })
  jurisdiccionGeograficaId: number;

  @ManyToOne(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.instituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'jurisdiccion_geografica_id', referencedColumnName: 'id'})
  jurisdiccionGeografica: JurisdiccionGeografica;
  
  @OneToMany(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.institucionEducativa)
  sucursales: InstitucionEducativaSucursal[];

  @OneToMany(() => InstitucionEducativaAcreditacion, (institucionEducativaAcreditacion) => institucionEducativaAcreditacion.institucionEducativa)
  acreditados: InstitucionEducativaAcreditacion[];
  
  @OneToMany(() => TramiteInstitucionEducativa, (tramiteInstitucionEducativa) => tramiteInstitucionEducativa.institucionEducativa)
  tramitesInstituciones: TramiteInstitucionEducativa[];

}
