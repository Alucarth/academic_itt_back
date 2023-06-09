import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';
import { Tarea } from './tarea.entity';

@Entity({ name: 'jurisdiccion_validacion_tipo', schema: 'public' })
export class JurisdiccionValidacionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'jurisdiccion_validacion' })
  jurisdiccionValidacion: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;
 
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

  @OneToMany(() => JurisdiccionGeografica, (jurisdiccionGeografica) => jurisdiccionGeografica.jurisdiccionValidacionTipo)
  jurisdiccionesGeograficas: JurisdiccionGeografica[];
  

}
