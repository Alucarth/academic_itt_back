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
import { AsignaturaTipo } from './asignaturaTipo.entity';
import { CampoSaberTipo } from './campoSaberTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EspecialidadTipo } from './especialidadTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { EtapaEducativaAsignaturaNivelAcademico } from './etapaEducativaAsignaturaNivelAcademico.entity';
import { EtapaEducativaTipo } from './etapaEducativaTipo.entity';
import { IntervaloTiempoTipo } from './intervaloTiempoTipo.entity';
import { PlanEstudio } from './planEstudio.entity';

@Entity({ name: 'etapa_educativa_asignatura', schema: 'public' })
export class EtapaEducativaAsignatura {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'carga_horaria' })
  cargaHoraria: number;

  @Column({name:'opcional', type: 'bool', default: true })
  opcional: boolean;
    
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
  
  @ManyToOne(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'etapa_educativa_id', referencedColumnName: 'id'})
  etapaEducativa: EtapaEducativa;

  @ManyToOne(() => AsignaturaTipo, (asignaturaTipo) => asignaturaTipo.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'asignatura_tipo_id', referencedColumnName: 'id'})
  asignaturaTipo: AsignaturaTipo;

  @ManyToOne(() => IntervaloTiempoTipo, (intervaloTiempoTipo) => intervaloTiempoTipo.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_tiempo_tipo_id', referencedColumnName: 'id'})
  intervaloTiempoTipo: IntervaloTiempoTipo;

  @ManyToOne(() => PlanEstudio, (planEstudio) => planEstudio.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_id', referencedColumnName: 'id'})
  planEstudio: PlanEstudio;

  @ManyToOne(() => EspecialidadTipo, (especialidadTipo) => especialidadTipo.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'especialidad_tipo_id', referencedColumnName: 'id'})
  especialidadTipo: EspecialidadTipo;

  @ManyToOne(() => CampoSaberTipo, (campoSaberTipo) => campoSaberTipo.etapasEducativasAsignaturas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'campo_saber_tipo_id', referencedColumnName: 'id'})
  campoSaberTipo: CampoSaberTipo;

  @OneToMany(() => EtapaEducativaAsignaturaNivelAcademico, (etapaEducativaAsignaturaNivelAcademico) => etapaEducativaAsignaturaNivelAcademico.etapaEducativaAsignatura)
  asignaturasNivelesAcademicos: EtapaEducativaAsignaturaNivelAcademico[];
  

}
