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
import { EducacionTipo } from './educacionTipo.entity';
import { EtapaEducativaAsignatura } from './etapaEducativaAsignatura.entity';
import { EtapaEducativaTipo } from './etapaEducativaTipo.entity';
import { InstitucionEducativaAcreditacionEtapaEducativa } from './institucionEducativaAcreditacionEtapaEducativa.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';

@Entity({ name: 'etapa_educativa', schema: 'public' })
export class EtapaEducativa {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'etapa_educativa' })
  etapaEducativa: string;



  @Column({ type: 'integer', name: 'ordinal' })
  ordinal: number;

  @Column({ type: 'integer', name: 'edad_minima' })
  edadMinima: number;

  @Column({ type: 'integer', name: 'edad_maxima' })
  edadMaxima: number;
    
  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Column({ type: 'integer', name: 'carga_horaria_minima' })
  cargaHorariaMinima: number;

  @Column({ type: 'integer', name: 'carga_horaria_maxima' })
  cargaHorariaMaxima: number;

  @Column({ type: 'varchar', name: 'codigo' })
  codigo: string;
  
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
  
  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.etapasEducativas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;

  @ManyToOne(() => EtapaEducativaTipo, (etapaEducativaTipo) => etapaEducativaTipo.etapasEducativas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'etapa_educativa_tipo_id', referencedColumnName: 'id'})
  etapaEducativaTipo: EtapaEducativaTipo;

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.etapaEducativa)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];

  @OneToMany(() => InstitucionEducativaAcreditacionEtapaEducativa, (institucionEducativaAcreditacionEtapaEducativa) => institucionEducativaAcreditacionEtapaEducativa.etapaEducativa)
  acreditadosEtapasEducativas: InstitucionEducativaAcreditacionEtapaEducativa[];

  @OneToMany(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.etapaEducativa)
  cursos: InstitucionEducativaCurso[];

  @OneToMany(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.etapaEducativaId)
  etapaEducativaList: EtapaEducativa[];

  @ManyToOne(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.etapaEducativaList)
  @JoinColumn({ name: 'etapa_educativa_id', referencedColumnName: 'id'})
  etapaEducativaId: EtapaEducativa;

  /*@Column({ type: 'varchar', name: 'etapa_educativa_id' })
  etapaEducativaId: string;*/

  @OneToMany(() => OperativoEtapaEducativa, (operativoEtapaEducativa) => operativoEtapaEducativa.etapaEducativa)
  operativosEtapas: OperativoEtapaEducativa[];

}
