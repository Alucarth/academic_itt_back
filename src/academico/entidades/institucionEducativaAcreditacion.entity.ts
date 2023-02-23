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
import { AcreditacionTipo } from './acreditacionTipo.entity';
import { ConvenioTipo } from './convenioTipo.entity';
import { DependenciaTipo } from './dependenciaTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EstadoInstitucionEductivaTipo } from './estadoInstitucionEducativaTipo.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaAcreditacionEtapaEducativa } from './institucionEducativaAcreditacionEtapaEducativa.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';

@Entity({ name: 'institucion_educativa_acreditacion', schema: 'public' })
export class InstitucionEducativaAcreditacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'fecha_resolucion' })
  fechaResolucion: Date;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({ type: 'varchar', name: 'numero_resolucion' })
  numeroResolucion: string;

  @Column({name:'vigente', type: 'bool', default: true })
  vigente: boolean;

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

  @ManyToOne(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.acreditados, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_id', referencedColumnName: 'id'})
  institucionEducativa: InstitucionEducativa;
  
  @ManyToOne(() => AcreditacionTipo, (acreditacionTipo) => acreditacionTipo.acreditados, { nullable: false, cascade: true })
  @JoinColumn({ name: 'acreditacion_tipo_id', referencedColumnName: 'id'})
  acreditacionTipo: AcreditacionTipo;
 
  @ManyToOne(() => ConvenioTipo, (convenioTipo) => convenioTipo.acreditados, { nullable: false, cascade: true })
  @JoinColumn({ name: 'convenio_tipo_id', referencedColumnName: 'id'})
  convenioTipo: ConvenioTipo;

  @ManyToOne(() => DependenciaTipo, (dependenciaTipo) => dependenciaTipo.acreditados, { nullable: false, cascade: true })
  @JoinColumn({ name: 'dependencia_tipo_id', referencedColumnName: 'id'})
  dependenciaTipo: DependenciaTipo;
  
  @OneToMany(() => InstitucionEducativaAcreditacionEtapaEducativa, (institucionEducativaAcreditacionEtapaEducativa) => institucionEducativaAcreditacionEtapaEducativa.institucionEducativaAcreditacion)
  acreditadosEtapasEducativas: InstitucionEducativaAcreditacionEtapaEducativa[];

}
