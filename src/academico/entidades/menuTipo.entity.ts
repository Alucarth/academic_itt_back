import { Exclude } from 'class-transformer';
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
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { UnidadTerritorialUsuarioRolApp } from './unidadTerritorialUsuarioRolApp.entity';
import { MenuNivelTipo } from './menuNivelTipo.entity';
import { MenuSistema } from './menuSistema.entity';

@Entity({ name: 'menu_tipo', schema: 'public' })
export class MenuTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'ruta' })
  ruta: string;

  @Column({ type: 'varchar', name: 'icono' })
  icono: string;

  @Column({ type: 'varchar', name: 'detalle_menu' })
  detalleMenu: string;

  @Column({ type: 'varchar', name: 'obs' })
  obs: string;

 
  
  @Exclude()
  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;
  
  @Column({ type: 'integer', name: 'menu_tipo_id' })
  menuTipoId: number;

  @Column({ type: 'integer', name: 'menu_nivel_tipo_id' })
  menuNivelTipoId: number;

  @ManyToOne(() => MenuNivelTipo, (menuNivelTipo) => menuNivelTipo.menusTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'menu_nivel_tipo_id', referencedColumnName: 'id'})
  menuNivelTipo: MenuNivelTipo;

  @OneToMany(() => MenuSistema , (menuSistema) => menuSistema.menuTipo)
  menusSistemas: MenuSistema[];
  
}
