import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';


@Entity({ name: 'persona', schema: 'public' })
export class Persona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'carnet_identidad',
  })
  carnetIdentidad: string;

  @MinLength(0)
  @MaxLength(2)
  @Column({ type: 'varchar', length: 2, default: '', name: 'complemento' })
  complemento: string;

  @MinLength(0)
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  paterno: string;

  @MinLength(0)
  @MaxLength(100)
  @Column({ type: 'varchar', length: 100 })
  materno: string;

  @MinLength(0)
  @MaxLength(150)
  @Column({ type: 'varchar', length: 150, nullable: false })
  nombre: string;

  @Column({ type: 'date', name: 'fecha_nacimiento' })
  fechaNacimiento: Date;

  @MaxLength(30)
  @Column({ type: 'varchar', length: 30, name: 'codigo_rude', default: '' })
  codigoRude: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    name: 'nacimiento_oficialia',
  })
  nacimientoOficialia: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    name: 'nacimiento_libro',
  })
  nacimientoLibro: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    name: 'nacimiento_partida',
  })
  nacimientoPartida: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    name: 'nacimiento_folio',
  })
  nacimientoFolio: string;

  @Column({ type: 'varchar', length: 15, default: '', name: 'carnet_ibc' })
  carnetIbc: string;

  @Column({ type: 'varchar', length: 50, default: '', name: 'pasaporte' })
  pasaporte: string;

  @Column({ type: 'varchar', length: 20, default: '', name: 'libreta_militar' })
  libretaMilitar: string;

  @Column({
    type: 'boolean',
    default: false,
    nullable: false,
    name: 'doble_nacionalidad',
  })
  dobleNacionalidad: boolean;

  @Column({ type: 'varchar', length: 20, default: '', name: 'codigo_rda' })
  codigoRda: string;

  @Column({
    type: 'varchar',
    length: 250,
    default: '',
    name: 'nacimiento_localidad',
  })
  nacimientoLocalidad: string;

  @Column({ type: 'varchar', length: 500, default: '', name: 'observacion' })
  observacion: string;

  @Column({ type: 'boolean', default: false, name: 'tiene_discapacidad' })
  tieneDiscapacidad: boolean;

  @Column({ type: 'bigint', default: 0, name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'bigint', default: 0, name: 'persona_id' })
  personaId: number;

  @Column({ type: 'bigint', default: 0, name: 'estudiante_id' })
  estudianteId: number;

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

}
