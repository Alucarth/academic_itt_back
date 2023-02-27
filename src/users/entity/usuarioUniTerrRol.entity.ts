import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'unidad_territorial_usuario_rol', schema: 'public' })
export class UsuarioUniTerrRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  unidad_territorial_id: number;

  @Column({ nullable: false })
  usuario_rol_id: number;
  
  @Column({ nullable: false })
  usuario_id: number;

 @Column({ name: 'fecha_inicio', type: 'timestamp'})
  fecha_inicio: Date;

  @Column({ name: 'fecha_fin', type: 'timestamp'})
  fecha_fin: Date; 
  
  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaModificacion: Date;
}
