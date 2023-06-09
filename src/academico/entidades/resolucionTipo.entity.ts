import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizadaResolucion } from './carreraAutorizadaResolucion.entity';

@Entity({ name: 'resolucion_tipo', schema: 'public' })
export class ResolucionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'resolucion_tipo' })
  resolucionTipo: string;
  
 
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


  @OneToMany(() => CarreraAutorizadaResolucion, (carreraAutorizadaResolucion) => carreraAutorizadaResolucion.carreraAutorizada)
  resoluciones: CarreraAutorizadaResolucion[];
  
}
