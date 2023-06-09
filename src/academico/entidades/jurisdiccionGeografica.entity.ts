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
import { AcreditacionTipo } from './acreditacionTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { JurisdiccionValidacionTipo } from './jurisdiccionValidacionTipo.entity';
import { UnidadTerritorial } from './unidadTerritorial.entity';

@Entity({ name: 'jurisdiccion_geografica', schema: 'public' })
export class JurisdiccionGeografica {
  @PrimaryGeneratedColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1
  @Column({ type: 'integer', name: 'codigo_edificio_educativo' })
  codigoEdificioEducativo: number;

  @Column({ type: 'varchar', name: 'nombre_edificio_educativo' })
  nombreEdificioEducativo: string;

  @Column({ type: 'integer', name: 'cordx' })
  cordx: number;

  @Column({ type: 'integer', name: 'cordy' })
  cordy: number;

  @Column({ type: 'varchar', name: 'direccion' })
  direccion: string;

  @Column({ type: 'varchar', name: 'zona' })
  zona: string;

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
  usuarioId: number;

  @Exclude()
  @CreateDateColumn({
    name: 'fecha_modificacion_localizacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacionLocalizacion: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion_coordenada',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacionCoordenada: Date;

  
 
  @OneToMany(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.jurisdiccionGeografica)
  instituciones: InstitucionEducativa[];
  
  @OneToMany(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.jurisdiccionGeografica)
  sucursales: InstitucionEducativaSucursal[];

  
@Column({ name: 'distrito_unidad_territorial_id', nullable:false })
distritoUnidadTerritorialId: number;

@ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.jurisdiccionesGeograficas, { nullable: false, cascade: true })
@JoinColumn({ name: 'distrito_unidad_territorial_id', referencedColumnName: 'id'})
distritoUnidadTerritorial: UnidadTerritorial;


@Column({ name: 'localidad_unidad_territorial_2001_id', nullable:false })
localidadUnidadTerritorial2001Id: number;

@ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.jurisdiccionesGeograficas, { nullable: false, cascade: true })
@JoinColumn({ name: 'localidad_unidad_territorial_2001_id', referencedColumnName: 'id'})
localidadUnidadTerritorial2001: UnidadTerritorial;

@Column({ name: 'localidad_unidad_territorial_2012_id', nullable:false })
localidadUnidadTerritorial2012Id: number;

@ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.jurisdiccionesGeograficas2012, { nullable: false, cascade: true })
@JoinColumn({ name: 'localidad_unidad_territorial_2012_id', referencedColumnName: 'id'})
localidadUnidadTerritorial2012: UnidadTerritorial;

@Column({ name: 'jurisdiccion_validacion_tipo_id', nullable:false })
jurisdiccionValidacionTipoId: number;

@ManyToOne(() => JurisdiccionValidacionTipo, (jurisdiccionValidacionTipo) => jurisdiccionValidacionTipo.jurisdiccionesGeograficas, { nullable: false, cascade: true })
@JoinColumn({ name: 'jurisdiccion_validacion_tipo_id', referencedColumnName: 'id'})
jurisdiccionValidacionTipo: JurisdiccionValidacionTipo;

@Column({ name: 'acreditacion_tipo_id', nullable:false })
acreditacionTipoId: number;

@ManyToOne(() => AcreditacionTipo, (acreditacionTipo) => acreditacionTipo.jurisdiccionesGeograficas, { nullable: false, cascade: true })
@JoinColumn({ name: 'acreditacion_tipo_id', referencedColumnName: 'id'})
acreditacionTipo: AcreditacionTipo;

}
