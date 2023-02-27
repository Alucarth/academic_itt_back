import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usuario_rol', schema: 'public' })
export class UsuarioRol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  usuario_id: number;

  @Column({ nullable: false })
  rol_tipo_id: number;
  
  @Column({ nullable: false })
  activo: boolean;
  
  @CreateDateColumn({ name: 'fecha_registro', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion', type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
  fechaModificacion: Date;
}
