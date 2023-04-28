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
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';
import { Persona } from './persona.entity';
import { UnidadTerritorialTipo } from './unidadTerritorialTipo.entity';
import { UnidadTerritorialUsuarioRol } from './unidadTerritorialUsuarioRol.entity';

@Entity({ name: 'unidad_territorial', schema: 'public' })
export class UnidadTerritorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'lugar' })
  lugar: string;

  @Column({ type: 'varchar', name: 'codigo' })
  codigo: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;
  
  @Column({ type: 'integer', name: 'poblacion' })
  poblacion: number;

  @Column({ type: 'integer', name: 'viviendas' })
  viviendas: number;

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

  @OneToMany(() => Persona, (persona) => persona.expedidoUnidadTerritorial)
  personasExpedidos: Persona[];

  @OneToMany(() => Persona, (persona) => persona.nacimientoUnidadTerritorial)
  personasNacimiento: Persona[];

  @OneToMany(() => UnidadTerritorialUsuarioRol, (unidadTerritorialUsuarioRol) => unidadTerritorialUsuarioRol.unidadTerritorial)
  unidadesTerritorialesUsuariosRoles: UnidadTerritorialUsuarioRol[];
  
  @OneToMany(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.distritoUnidadTerritorial)
  jurisdiccionesGeograficas: JurisdiccionGeografica[];

  @OneToMany(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.localidadUnidadTerritorial2001)
  jurisdiccionesGeograficas2001: JurisdiccionGeografica[];

  @OneToMany(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.localidadUnidadTerritorial2012)
  jurisdiccionesGeograficas2012: JurisdiccionGeografica[];

  @OneToMany(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.unidadTerritorialPadre)
  unidadTerritorialList: UnidadTerritorial[];

  @ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.unidadTerritorialList)
  @JoinColumn({ name: 'unidad_territorial_id', referencedColumnName: 'id'})
  unidadTerritorialPadre: UnidadTerritorial;

  @Column({ type: 'integer', name: 'unidad_territorial_tipo_id' })
  unidadTerritorialTipoId: number;

  @ManyToOne(() => UnidadTerritorialTipo, (unidadTerritorialTipo) => unidadTerritorialTipo.unidadesTerritoriales)
  @JoinColumn({ name: 'unidad_territorial_tipo_id', referencedColumnName: 'id'})
  unidadTerritorialTipo: UnidadTerritorialTipo;

}
