import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CarreraAutorizadaResolucion } from './carreraAutorizadaResolucion.entity';

@Entity({ name: 'regimen_grado_tipo', schema: 'public' })
export class RegimenGradoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'resolucion_tipo' })
  resolucionTipo: string;
  
 
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
  usuarioId: number;


  @OneToMany(() => CarreraAutorizadaResolucion, (carreraAutorizadaResolucion) => carreraAutorizadaResolucion.carreraAutorizada)
  resoluciones: CarreraAutorizadaResolucion[];
  
}
