import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { MaestroInscripcionIdioma } from './maestroInscripcionIdioma.entity';

@Entity({ name: 'percepcion_tipo', schema: 'public' })
export class PercepcionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'percepcion' })
  percepcion: string;

  @Column({ type: 'boolean', name: 'activo' })
  activo: boolean;
  
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

  @OneToMany(() => MaestroInscripcionIdioma , (maestroInscripcionIdioma) => maestroInscripcionIdioma.percepcionTipo)
  maestrosInscripcionesIdiomas: MaestroInscripcionIdioma[];
  
}
