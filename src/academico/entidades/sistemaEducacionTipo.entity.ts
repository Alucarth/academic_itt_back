import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EducacionTipo } from './educacionTipo.entity';

@Entity({ name: 'sistema_educacion_tipo', schema: 'public' })
export class SistemaEducacionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1

  @Column({ type: 'varchar', name: 'educacion' })
  sistema_educacion: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

 @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Exclude()
  @UpdateDateColumn({
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
  uduarioId: string;

  @OneToMany(() => EducacionTipo, (educacionTipo) => educacionTipo.sistemaEducacionTipo)
  educacionTipos: EducacionTipo[];
}
