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
import { CiExpedidoTipo } from './ciExpedidoTipo.entity';
import { EstadoCivilTipo } from './estadoCivilTipo.entity';
import { GeneroTipo } from './generoTipo.entity';
import { IdiomaTipo } from './idiomaTipo.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { Operativo } from './operativo.entity';
import { PersonaDetalle } from './personaDetalle.entity';
import { SangreTipo } from './sangreTipo.entity';
import { SegipTipo } from './segipTipo.entity';
import { UnidadTerritorial } from './unidadTerritorial.entity';

@Entity({ name: 'persona', schema: 'public' })
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'carnet_identidad' })
  carnetIdentidad: string;

  @Column({ type: 'varchar', name: 'complemento' })
  complemento: string;

  @Column({ type: 'varchar', name: 'paterno' })
  paterno: string;

  @Column({ type: 'varchar', name: 'materno' })
  materno: string;

  @Column({ type: 'varchar', name: 'nombre' })
  nombre: string;
  
  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fechaNacimiento: string;

  @Column({ type: 'varchar', name: 'codigo_rude' })
  codigoRude: string;

  @Column({ type: 'varchar', name: 'nacimiento_oficilia' })
  nacimientoOficilia: string;

  @Column({ type: 'varchar', name: 'nacimiento_libro' })
  nacimientoLibro: string;

  @Column({ type: 'varchar', name: 'nacimiento_partida' })
  nacimientoPartida: string;

  @Column({ type: 'varchar', name: 'nacimiento_folio' })
  nacimientoFolio: string;

  @Column({ type: 'varchar', name: 'carnet_ibc' })
  carnetIbc: string;

  @Column({ type: 'varchar', name: 'pasaporte' })
  pasaporte: string;

  @Column({ type: 'varchar', name: 'libreta_militar' })
  libretaMilitar: string;

  @Column({ type: 'bool', name: 'doble_nacionalidad' })
  dobleNacionalidad: boolean;

  @Column({ type: 'varchar', name: 'codigo_rda' })
  codigoRda: string;

  @Column({ type: 'varchar', name: 'nacimiento_localidad' })
  nacimientoLocalidad: string;
    
  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({name:'tiene_discapacidad', type: 'bool', default: true })
  tieneDiscapacidad: boolean;

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

  @Column({ type: 'integer', name: 'persona_id' })
  personaId: number;

  @Column({ type: 'integer', name: 'estudiante_id' })
  estudianteId: number;

  @Column({ type: 'varchar', name: 'telefono' })
  telefono: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @ManyToOne(() => GeneroTipo, (generoTipo) => generoTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'genero_tipo_id', referencedColumnName: 'id'})
  generoTipo: GeneroTipo;

  @ManyToOne(() => SangreTipo, (sangreTipo) => sangreTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'sangre_tipo_id', referencedColumnName: 'id'})
  sangreTipo: SangreTipo;
  
  @ManyToOne(() => SegipTipo, (segipTipo) => segipTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'segip_tipo_id', referencedColumnName: 'id'})
  segipTipo: SegipTipo;

  @ManyToOne(() => EstadoCivilTipo, (estadoCivilTipo) => estadoCivilTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'estado_civil_tipo_id', referencedColumnName: 'id'})
  estadoCivilTipo: EstadoCivilTipo;

  @ManyToOne(() => IdiomaTipo, (idiomaTipo) => idiomaTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'materno_idioma_tipo_id', referencedColumnName: 'id'})
  maternoIdiomaTipo: IdiomaTipo;

  @ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.personasExpedidos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'expedido_unidad_territorial_id', referencedColumnName: 'id'})
  expedidoUnidadTerritorial: UnidadTerritorial;

  @ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.personasNacimiento, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nacimiento_unidad_territorial_id', referencedColumnName: 'id'})
  nacimientoUnidadTerritorial: UnidadTerritorial;

  @ManyToOne(() => CiExpedidoTipo, (ciExpedidoTipo) => ciExpedidoTipo.personas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'idioma_tipo_id', referencedColumnName: 'id'})
  ciExpedidoTipo: CiExpedidoTipo;
   
  @OneToMany(() => PersonaDetalle, (personaDetalle) => personaDetalle.persona)
  personasDetalles: PersonaDetalle[];

  
}
