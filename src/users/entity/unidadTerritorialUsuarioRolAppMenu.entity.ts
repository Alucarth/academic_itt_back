import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'unidad_territorial_usuario_rol_app_menu', schema: 'public' })
export class UnidadTerritorialUsuarioRolAppMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  unidad_territorial_usuario_rol_app_id: number;

  @Column({ nullable: false })
  menu_tipo_id: number;
  
  @Column({ nullable: false })
  activo: boolean;
  
  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaModificacion: Date;
  
  @Column({ nullable: false })
  usuario_id: number;
}
