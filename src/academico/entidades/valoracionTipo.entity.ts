import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from './institutoEstudianteInscripcionDocenteCalificacion.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { MenuNivelTipo } from './menuNivelTipo.entity';
import { MenuSistema } from './menuSistema.entity';

@Entity({ name: 'valoracion_tipo', schema: 'public' })
export class ValoracionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'valoracion' })
  valoracion: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;
  
  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;
  
  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @OneToMany(() => InstitutoEstudianteInscripcionDocenteCalificacion, (institutoEstudianteInscripcionDocenteCalificacion) => institutoEstudianteInscripcionDocenteCalificacion.valoracionTipo)
  inscripcionesDocentesCalificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[];  
  

}
