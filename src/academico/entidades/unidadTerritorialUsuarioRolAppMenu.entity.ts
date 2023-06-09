import { Exclude } from 'class-transformer';
import { UsuarioRol } from 'src/users/entity/usuarioRol.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppTipo } from './appTipo.entity';
import { UnidadTerritorial } from './unidadTerritorial.entity';
import { UnidadTerritorialUsuarioRol } from './unidadTerritorialUsuarioRol.entity';
import { UnidadTerritorialUsuarioRolApp } from './unidadTerritorialUsuarioRolApp.entity';

@Entity({ name: 'unidad_territorial_usuario_rol_app_menu', schema: 'public' })
export class UnidadTerritorialUsuarioRolAppMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
  
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
  
  @ManyToOne(() => AppTipo, (appTipo) => appTipo.unidadesTerritorialesUsuariosRolesApps, { nullable: false, cascade: true })
  @JoinColumn({ name: 'app_tipo_id', referencedColumnName: 'id'})
  menuTipo: AppTipo;

  @ManyToOne(() => UnidadTerritorialUsuarioRolApp, (unidadTerritorialUsuarioRolApp) => unidadTerritorialUsuarioRolApp.unidadesTerritorialesUsuariosRolesAppsMenus, { nullable: false, cascade: true })
  @JoinColumn({ name: 'unidad_territorial_usuario_rol_app_id', referencedColumnName: 'id'})
  unidadTerritorialUsuarioRolApp: UnidadTerritorialUsuarioRolApp;

}
