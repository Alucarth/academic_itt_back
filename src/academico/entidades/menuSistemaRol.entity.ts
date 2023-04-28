import { Exclude } from 'class-transformer';
import {
  Column,
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
import { MenuSistema } from './menuSistema.entity';
import { RolTipo } from './rolTipo.entity';

@Entity({ name: 'menu_sistema_rol', schema: 'public' })
export class MenuSistemaRol {
  @PrimaryGeneratedColumn()
  id: number;
    
  @Column({ type: 'date', name: 'fecha_inicio' })
  fechaInicio: string;

  @Column({ type: 'date', name: 'fecha_fin' })
  fechaFin: string;
  
  @Column({ type: 'boolean', name: 'esactivo' })
  esactivo: boolean;


  @Column({ type: 'integer', name: 'menu_sistema_id' })
  menuSistemaId: number;

  @ManyToOne(() => MenuSistema, (menuSistema) => menuSistema.menusSistemasRoles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'menu_sistema_id', referencedColumnName: 'id'})
  menuSistema: MenuSistema;

  @Column({ type: 'integer', name: 'rol_tipo_id' })
  rolTipoId: number;

  @ManyToOne(() => RolTipo, (rolTipo) => rolTipo.menusSistemasRoles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'rol_tipo_id', referencedColumnName: 'id'})
   rolTipo: RolTipo;
}
