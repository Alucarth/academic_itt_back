import { Exclude } from 'class-transformer';
import { UsuarioRol } from 'src/users/entity/usuarioRol.entity';
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
import { AppTipo } from './appTipo.entity';
import { UnidadTerritorial } from './unidadTerritorial.entity';
import { UnidadTerritorialUsuarioRolApp } from './unidadTerritorialUsuarioRolApp.entity';

@Entity({ name: 'unidad_territorial_usuario_rol', schema: 'public' })
export class UnidadTerritorialUsuarioRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: string;

  
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

  @Column({ type: 'integer', name: 'usuario_rol_id' })
  usuarioRolId: number;
  
  @ManyToOne(() => UnidadTerritorial, (unidadTerritorial) => unidadTerritorial.unidadesTerritorialesUsuariosRoles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'unidad_territorial_id', referencedColumnName: 'id'})
  unidadTerritorial: UnidadTerritorial;

  @ManyToOne(() => UsuarioRol, (usuarioRol) => usuarioRol.id, { nullable: false, cascade: true })
  @JoinColumn({ name: 'usuario_rol_id', referencedColumnName: 'id'})
  usuarioRol: UsuarioRol;

  @OneToMany(() => UnidadTerritorialUsuarioRolApp, (unidadTerritorialUsuarioRolApp) => unidadTerritorialUsuarioRolApp.unidadTerritorialUsuarioRol)
  unidadesTerritorialesUsuariosRolesApps: UnidadTerritorialUsuarioRolApp[];
  


}
