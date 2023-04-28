import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';

@Entity({ name: 'acreditacion_tipo', schema: 'public' })
export class AcreditacionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'acreditacion' })
  acreditacion: string;

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

  @OneToMany(() => InstitucionEducativaAcreditacion, (institucionEducativaAcreditacion) => institucionEducativaAcreditacion.acreditacionTipo)
  acreditados: InstitucionEducativaAcreditacion[];

  @OneToMany(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.acreditacionTipo)
  jurisdiccionesGeograficas: JurisdiccionGeografica[];
}
