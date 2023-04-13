import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuario_rol_menu_tipo', schema: 'public' })
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  usuario_rol_id: number;

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
