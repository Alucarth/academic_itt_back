import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AsignaturaTipo } from './asignaturaTipo.entity';
import { CampoSaberTipo } from './campoSaberTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EspecialidadTipo } from './especialidadTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { EtapaEducativaTipo } from './etapaEducativaTipo.entity';
import { IntervaloTiempoTipo } from './intervaloTiempoTipo.entity';
import { NivelAcademicoTipo } from './nivelAcademicoTipo.entity';
import { PlanEstudio } from './planEstudio.entity';

@Entity({ name: 'etapa_educativa_asignatura_nivel_academico', schema: 'public' })
export class EtapaEducativaAsignaturaNivelAcademico {

  @PrimaryGeneratedColumn()
  id: number;

    
  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;
  
  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

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
  
  
  @ManyToOne(() => NivelAcademicoTipo, (nivelAcademicoTipo) => nivelAcademicoTipo.asignaturasNivelesAcademicos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'nivel_academico_tipo_id', referencedColumnName: 'id'})
  nivelAcademicoTipo: NivelAcademicoTipo;

  @ManyToOne(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.asignaturasNivelesAcademicos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'campo_saber_tipo_id', referencedColumnName: 'id'})
  etapaEducativaAsignatura: EtapaEducativaAsignatura;

}
