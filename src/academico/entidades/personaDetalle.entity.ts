import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persona } from './persona.entity';

@Entity({ name: 'persona_detalle', schema: 'public' })
export class PersonaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'telefono_celular' })
  telefonoCelular: string;

  @Column({ type: 'varchar', name: 'telefono' })
  telefono: string;

  @Column({ type: 'varchar', name: 'direccion' })
  direccion: string;

  @Column({ type: 'varchar', name: 'zona' })
  zona: string;

  @Column({ type: 'varchar', name: 'foto' })
  foto: string;
  
  @Column({ type: 'date', name: 'correo_electronico' })
  correoElectronico: string;
 
  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
  
  @ManyToOne(() => Persona, (persona) => persona.personasDetalles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  persona: Persona;

}