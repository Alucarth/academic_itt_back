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
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { CarreraTipo } from './carrerraTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EstadoInstitucionEductivaTipo } from './estadoInstitucionEducativaTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { Operativo } from './operativo.entity';

@Entity({ name: 'institucion_educativa_sucursal', schema: 'public' })
export class InstitucionEducativaSucursal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'sucursal_codigo' })
  sucursalCodigo: number;

  @Column({ type: 'varchar', name: 'sucursal_nombre' })
  sucursalNombre: string;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({ type: 'varchar', name: 'telefono1' })
  telefono1: string;
  
  @Column({ type: 'varchar', name: 'telefono2' })
  telefono2: string;

  @Column({ type: 'varchar', name: 'correo' })
  correo: string;

  @Column({ type: 'varchar', name: 'casilla' })
  casilla: string;

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

  @Column({ type: 'integer', name: 'jurisdiccion_geografica_id' })
  jurisdiccionGeograficaId: number;

  @ManyToOne(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.sucursales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'jurisdiccion_geografica_id', referencedColumnName: 'id'})
  jurisdiccionGeografica: JurisdiccionGeografica;

  @Column({ type: 'integer', name: 'gestion_tipo_id' })
  gestionTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.sucursales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;

  @Column({ type: 'integer', name: 'institucion_educativa_id' })
  institucionEducativaId: number;

  @ManyToOne(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.sucursales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_id', referencedColumnName: 'id'})
  institucionEducativa: InstitucionEducativa;
  
  @Column({ type: 'integer', name: 'estado_institucion_educativa_tipo_id' })
  estadoInstitucionEducativaTipoId: number;

  @ManyToOne(() => EstadoInstitucionEductivaTipo, (estadoInstitucionEducativaTipo) => estadoInstitucionEducativaTipo.sucursales, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_institucion_educativa_tipo_id', referencedColumnName: 'id'})
  estadoInstitucionEducativaTipo: EstadoInstitucionEductivaTipo;

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidad, (institucionEducativaAcreditacionEspecialidad) => institucionEducativaAcreditacionEspecialidad.institucionEducativaSucursal)
  acreditacionEspecialidades: InstitucionEducativaAcreditacionEspecialidad[];
  
  @OneToMany(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.institucionEducativaSucursal)
  cursos: InstitucionEducativaCurso[];

  @OneToMany(() => Operativo, (operativo) => operativo.institucionEducativaSucursal)
  operativos: Operativo[];

  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.institucionEducativaSucursal)
  maestrosInscripciones: MaestroInscripcion[];

  @OneToMany(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.institucionEducativaSucursal)
  carreras: CarreraAutorizada[];

}
