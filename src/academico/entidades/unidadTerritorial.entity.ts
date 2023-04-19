import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Persona } from './persona.entity';
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
  
}
