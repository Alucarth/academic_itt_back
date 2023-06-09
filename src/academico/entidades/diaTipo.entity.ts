import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AulaDetalle } from './aulaDetalle.entity';

@Entity({ name: 'dia_tipo', schema: 'public' })
export class DiaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'dia' })
  dia: string;

  @Column({ type: 'varchar', name: 'sigla' })
  sigla: string;

  @Column({name:'activo', type: 'bool', default: true })
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
  
  @OneToMany(() => AulaDetalle, (aulaDetalle) => aulaDetalle.diaTipo)
  aulasDetalles: AulaDetalle[];
}
