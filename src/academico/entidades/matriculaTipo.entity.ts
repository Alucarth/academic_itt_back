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
import { EstudianteInscripcion } from './estudianteInscripcion.entity';
import { EtapaEducativaAsignaturaNivelAcademico } from './etapaEducativaAsignaturaNivelAcademico.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';


@Entity({ name: 'matricula_tipo', schema: 'public' })
export class MatriculaTipo {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'matricula' })
  matricula: string;

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

  @OneToMany(() => EstudianteInscripcion, (estudianteInscripcion) => estudianteInscripcion.matriculaTipo)
  estudiantesInscripciones: EstudianteInscripcion[];    

}
