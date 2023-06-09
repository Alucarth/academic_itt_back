import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { MaestroInscripcionIdioma } from './maestroInscripcionIdioma.entity';

@Entity({ name: 'conocimiento_tipo', schema: 'public' })
export class ConocimientoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'conocimiento' })
  conocimiento: string;

  @Column({ type: 'boolean', name: 'activo' })
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

  @OneToMany(() => MaestroInscripcionIdioma , (maestroInscripcionIdioma) => maestroInscripcionIdioma.conocimientoTipo)
  maestrosInscripcionesIdiomas: MaestroInscripcionIdioma[];
  
}
