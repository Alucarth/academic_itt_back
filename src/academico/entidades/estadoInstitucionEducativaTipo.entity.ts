import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';

@Entity({ name: 'estado_institucion_educativa_tipo', schema: 'public' })
export class EstadoInstitucionEductivaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'estado_institucion_educativa' })
  estadoInstitucionEducativa: string;
    
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
  usuarioId: number;

  @OneToMany(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.estadoInstitucionEducativaTipo)
  instituciones: InstitucionEducativa[];
  
  @OneToMany(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.estadoInstitucionEducativaTipo)
  sucursales: InstitucionEducativaSucursal[];
}
