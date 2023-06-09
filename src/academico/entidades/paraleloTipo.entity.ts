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
import { Aula } from './aula.entity';
import { EtapaEducativaAsignaturaNivelAcademico } from './etapaEducativaAsignaturaNivelAcademico.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';


@Entity({ name: 'paralelo_tipo', schema: 'public' })
export class ParaleloTipo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'paralelo' })
  paralelo: string;

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

  @OneToMany(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.paraleloTipo)
  cursos: InstitucionEducativaCurso[];

  @OneToMany(() => Aula, (aula) => aula.paraleloTipo)
  aulas: Aula[];

}
