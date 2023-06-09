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
import { MenuTipo } from './menuTipo.entity';
import { AppTipo } from './appTipo.entity';
import { MenuSistemaRol } from './menuSistemaRol.entity';

@Entity({ name: 'menu_sistema', schema: 'public' })
export class MenuSistema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'icono' })
  icono: string;

  @Column({ type: 'varchar', name: 'detalle_menu' })
  detalleMenu: string;

  @Column({ type: 'integer', name: 'orden' })
  orden: number;

  
  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: string;
  
  
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

  @ManyToOne(() => MenuTipo, (menuTipo) => menuTipo.menusSistemas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'menu_tipo_id', referencedColumnName: 'id'})
  menuTipo: MenuTipo;

  @Column({ type: 'integer', name: 'app_tipo_id' })
  appTipoId: number;

  @ManyToOne(() => AppTipo, (appTipo) => appTipo.menusSistemas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'app_tipo_id', referencedColumnName: 'id'})
   appTipo: AppTipo;

   @OneToMany(() => MenuSistemaRol , (menuSistemaRol) => menuSistemaRol.menuSistema)
   menusSistemasRoles: MenuSistemaRol[];
  
   
}
