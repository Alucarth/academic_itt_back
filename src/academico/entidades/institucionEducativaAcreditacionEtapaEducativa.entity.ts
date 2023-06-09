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
import { EducacionTipo } from './educacionTipo.entity';
import { EstadoInstitucionEductivaTipo } from './estadoInstitucionEducativaTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaAcreditacion } from './institucionEducativaAcreditacion.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';

@Entity({ name: 'institucion_educativa_acreditacion_etapa_educativa', schema: 'public' })
export class InstitucionEducativaAcreditacionEtapaEducativa {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'fecha_resolucion' })
  fechaResolucion: String;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

  @Column({ type: 'varchar', name: 'numero_resolucion' })
  numeroResolucion: string;

  @Column({ type: 'integer', name: 'tiempo' })
  tiempo: number;

  @Column({ type: 'integer', name: 'carga_horaria' })
  cargaHoraria: number;

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

  @ManyToOne(() => InstitucionEducativaAcreditacion, (institucionEducativaAcreditacion) => institucionEducativaAcreditacion.acreditadosEtapasEducativas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_acreditacion_id', referencedColumnName: 'id'})
  institucionEducativaAcreditacion: InstitucionEducativaAcreditacion;

  @ManyToOne(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.acreditadosEtapasEducativas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'etapa_educativa_id', referencedColumnName: 'id'})
  etapaEducativa: EtapaEducativa;
}