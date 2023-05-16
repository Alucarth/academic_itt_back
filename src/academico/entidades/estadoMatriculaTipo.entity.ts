import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstudianteInscripcion } from './estudianteInscripcion.entity';
import { InstitutoEstudianteInscripcion } from './InstitutoEstudianteInscripcion.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'estado_matricula_tipo', schema: 'public' })
export class EstadoMatriculaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'estado_matricula' })
  estadoMatricula: string;

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

  @OneToMany(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.estadoMatriculaFinTipo)
  estudiantesInscripcionesFin: EstudianteInscripcion[]; 

  @OneToMany(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.estadoMatriculaInicioTipo)
  estudiantesInscripcionesInicio: EstudianteInscripcion[]; 

  @OneToMany(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.estadoMatriculaTipo)
  institutoEstudianteInscripcions: InstitutoEstudianteInscripcion[];
/*
  @OneToMany(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.estadoMatriculaInicioTipo)
  institutoEstudianteInscripcionsInicio: InstitutoEstudianteInscripcion[];
  */
}
