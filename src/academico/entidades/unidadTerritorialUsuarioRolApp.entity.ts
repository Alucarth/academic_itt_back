import { Exclude } from 'class-transformer';
import { UsuarioRol } from 'src/users/entity/usuarioRol.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppTipo } from './appTipo.entity';
import { UnidadTerritorial } from './unidadTerritorial.entity';
import { UnidadTerritorialUsuarioRol } from './unidadTerritorialUsuarioRol.entity';
import { UnidadTerritorialUsuarioRolAppMenu } from './unidadTerritorialUsuarioRolAppMenu.entity';

@Entity({ name: 'unidad_territorial_usuario_rol_app', schema: 'public' })
export class UnidadTerritorialUsuarioRolApp {
  @PrimaryGeneratedColumn()
  id: number;
  
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
  
  @ManyToOne(() => AppTipo, (appTipo) => appTipo.unidadesTerritorialesUsuariosRolesApps, { nullable: false, cascade: true })
  @JoinColumn({ name: 'app_tipo_id', referencedColumnName: 'id'})
  appTipo: AppTipo;

  @ManyToOne(() => UnidadTerritorialUsuarioRol, (unidadTerritorialUsuarioRol) => unidadTerritorialUsuarioRol.unidadesTerritorialesUsuariosRolesApps, { nullable: false, cascade: true })
  @JoinColumn({ name: 'unidad_territorial_usuario_rol_id', referencedColumnName: 'id'})
  unidadTerritorialUsuarioRol: UnidadTerritorialUsuarioRol;

  @OneToMany(() => UnidadTerritorialUsuarioRolAppMenu, (unidadTerritorialUsuarioRolAppMenu) => unidadTerritorialUsuarioRolAppMenu.unidadTerritorialUsuarioRolApp)
  unidadesTerritorialesUsuariosRolesAppsMenus: UnidadTerritorialUsuarioRolAppMenu[];
  

}
