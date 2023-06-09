import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuSistemaRol } from './menuSistemaRol.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'rol_tipo', schema: 'public' })
export class RolTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'rol' })
  rol: string;

  @Column({ type: 'integer', name: 'ordinal' })
  ordinal: number;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Column({ type: 'boolean', name: 'activo' })
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

  @Column({ type: 'integer', name: 'rol_tipo_id' })
  rolTipoId: number;
  
  @OneToMany(() => MenuSistemaRol , (menuSistemaRol) => menuSistemaRol.rolTipo)
  menusSistemasRoles: MenuSistemaRol[];
  
}
