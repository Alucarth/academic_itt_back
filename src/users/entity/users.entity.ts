import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Persona } from './persona.entity';

@Entity({ name: 'usuario', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;
  
  @Column({ nullable: false })
  activo: boolean;
  
  @CreateDateColumn({ name: 'fecha_registro' })
  fechaRegistro: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @Column({ nullable: false, name: 'persona_id' })
  personaId: number;

  @ManyToOne(() => Persona, (persona) => persona.id)
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  persona: Persona

}