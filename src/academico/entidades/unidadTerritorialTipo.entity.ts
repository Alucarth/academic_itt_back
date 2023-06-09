import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UnidadTerritorial } from './unidadTerritorial.entity';

@Entity({ name: 'unidad_territorial_tipo', schema: 'public' })
export class UnidadTerritorialTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'unidad_territorial' })
  unidadTerritorial: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Column({ type: 'integer', name: 'orden' })
  orden: number;
  
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

  @OneToMany(() => UnidadTerritorial , (unidadTerritorial) => unidadTerritorial.unidadTerritorialTipo)
  unidadesTerritoriales: UnidadTerritorial[];
  
  
}
