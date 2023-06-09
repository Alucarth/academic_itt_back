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
import { CarreraAutorizadaResolucion } from './carreraAutorizadaResolucion.entity';
import { EtapaEducativaAsignaturaNivelAcademico } from './etapaEducativaAsignaturaNivelAcademico.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';


@Entity({ name: 'nivel_academico_tipo', schema: 'public' })
export class NivelAcademicoTipo {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'nivel_academico' })
  nivelAcademico: string;
    
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

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidadNivelAcademico, (institucionEducativaAcreditacionEspecialidadNivelAcademico) => institucionEducativaAcreditacionEspecialidadNivelAcademico.nivelAcademicoTipo)
  especialidadesNivelesAcademicos: InstitucionEducativaAcreditacionEspecialidadNivelAcademico[];
  
  @OneToMany(() => EtapaEducativaAsignaturaNivelAcademico, (etapaEducativaAsignaturaNivelAcademico) => etapaEducativaAsignaturaNivelAcademico.nivelAcademicoTipo)
  asignaturasNivelesAcademicos: EtapaEducativaAsignaturaNivelAcademico[];

  @OneToMany(() => CarreraAutorizadaResolucion, (carreraAutorizadaResolucion) => carreraAutorizadaResolucion.carreraAutorizada)
  resoluciones: CarreraAutorizadaResolucion[];

  @OneToMany(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.nivelAcademicoTipo)
  planesCarreras: PlanEstudioCarrera[];
  
  
}
