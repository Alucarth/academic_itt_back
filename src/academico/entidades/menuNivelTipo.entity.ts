import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuTipo } from './menuTipo.entity';

@Entity({ name: 'menu_nivel_tipo', schema: 'public' })
export class MenuNivelTipo {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({ type: 'varchar', name: 'menu_nivel_tipo' })
  menuNivelTipo: string;
  
  @OneToMany(() => MenuTipo, (menuTipo) => menuTipo.menuNivelTipo)
  menusTipos: MenuTipo[];
}
