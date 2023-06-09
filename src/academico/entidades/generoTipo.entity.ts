import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OperativoCarreraAutorizada } from './operativoCarreraAutorizada.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'genero_tipo', schema: 'public' })
export class GeneroTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'genero' })
  genero: string;

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

  @OneToMany(() => Persona, (persona) => persona.generoTipo)
  personas: Persona[];
  

  @OneToMany(() => OperativoCarreraAutorizada, (operativoCarreraAutorizada) => operativoCarreraAutorizada.carreraAutorizada)
  operativosCarreras: OperativoCarreraAutorizada[];

  
}
