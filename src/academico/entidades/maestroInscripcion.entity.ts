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
import { AulaDocente } from './aulaDocente.entity';
import { CargoTipo } from './cargoTipo.entity';
import { EspecialidadTipo } from './especialidadTipo.entity';
import { FinanciamientoTipo } from './financiamientoTipo.entity';
import { FormacionTipo } from './formacionTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { IdiomaTipo } from './idiomaTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { MaestroInscripcionIdioma } from './maestroInscripcionIdioma.entity';
import { OfertaAcademicaMaestroInscripcion } from './ofertaAcademicaMaestroInscripcion.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'maestro_inscripcion', schema: 'public' })
export class MaestroInscripcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bool', name: 'normalista' })
  normalista: boolean;

  @Column({ type: 'bool', name: 'vigente' })
  vigente: boolean;

  @Column({ type: 'varchar', name: 'formacion_descripcion' })
  formacionDescripcion: string;

  @Column({ type: 'bool', name: 'braile' })
  braile: boolean;
   
  @Column({ type: 'date', name: 'asignacion_fecha_inicio' })
  asignacionFechaInicio: string;

  @Column({ type: 'date', name: 'asignacion_fecha_fin' })
  asignacionFechaFin: string;


  @Column({ type: 'varchar', name: 'item' })
  item: string;

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

  @Column({ type: 'integer', name: 'maestro_inscripcion_id_am' })
  maestroInscripcionIdAm: number;

  @Column({ type: 'integer', name: 'persona_id' })
  personaId: number;
  @ManyToOne(() => Persona, (persona) => persona.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  persona: Persona;
  
  @Column({ type: 'integer', name: 'institucion_educativa_sucursal_id' })
  institucionEducativaSucursalId: number; 
  @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaSucursal: InstitucionEducativaSucursal;
  
  @ManyToOne(() => IdiomaTipo, (idiomaTipo) => idiomaTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estudio_idioma_tipo_id', referencedColumnName: 'id'})
  estudioIdiomaTipo: IdiomaTipo;

  @Column({ type: 'integer', name: 'estudio_idioma_tipo_id' })
  estudioIdiomaTipoId: number;


  @ManyToOne(() => FormacionTipo, (formacionTipo) => formacionTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'formacion_tipo_id', referencedColumnName: 'id'})
  formacionTipo: FormacionTipo;

  @Column({ type: 'integer', name: 'formacion_tipo_id' })
  formacionTipoId: number;

  
  @Column({ type: 'integer', name: 'financiamiento_tipo_id' })
  financiamientoTipoId: number;
  
  @Column({type: 'float', name: 'horas_item'})
  horasItem: number;

  @ManyToOne(() => FinanciamientoTipo, (financiamientoTipo) => financiamientoTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'financiamiento_tipo_id', referencedColumnName: 'id'})
  financiamientoTipo: FinanciamientoTipo;

  @Column({ type: 'integer', name: 'cargo_tipo_id' })
  cargoTipoId: number;

  @ManyToOne(() => CargoTipo, (cargoTipo) => cargoTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'cargo_tipo_id', referencedColumnName: 'id'})
  cargoTipo: CargoTipo;

  @ManyToOne(() => EspecialidadTipo, (especialidadTipo) => especialidadTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'especialidad_tipo_id', referencedColumnName: 'id'})
  especialidadTipo: EspecialidadTipo;

  @Column({ type: 'integer', name: 'especialidad_tipo_id' })
  especialidadTipoId: number;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;

  @ManyToOne(() => PeriodoTipo, (periodoTipo) => periodoTipo.maestrosInscripciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'periodo_tipo_id', referencedColumnName: 'id'})
  periodoTipo: PeriodoTipo;

  @OneToMany(() => OfertaAcademicaMaestroInscripcion , (ofertaAcademicaMaestroInscripcion) => ofertaAcademicaMaestroInscripcion.maestroInscripcion)
  ofertasAcademicasMaestrosInscripciones: OfertaAcademicaMaestroInscripcion[];

  @OneToMany(() => MaestroInscripcionIdioma , (maestroInscripcionIdioma) => maestroInscripcionIdioma.maestroInscripcion)
  maestrosInscripcionesIdiomas: MaestroInscripcionIdioma[];

  @OneToMany(() => AulaDocente, (aulaDocente) => aulaDocente.maestroInscripcion)
  aulasDocentes: AulaDocente[];
  
}
