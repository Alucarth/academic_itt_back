import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { MaestroInscripcionIdioma } from './maestroInscripcionIdioma.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'idioma_tipo', schema: 'public' })
export class IdiomaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'idioma' })
  idioma: string;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;

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

  @OneToMany(() => Persona, (persona) => persona.maternoIdiomaTipo)
  personas: Persona[];

  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.estudioIdiomaTipo)
  maestrosInscripciones: MaestroInscripcion[];

  @OneToMany(() => MaestroInscripcionIdioma , (maestroInscripcionIdioma) => maestroInscripcionIdioma.idiomaTipo)
  maestrosInscripcionesIdiomas: MaestroInscripcionIdioma[];
  
  
}
