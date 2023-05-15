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
import { CarreraAutorizada } from './carreraAutorizada.entity';
import { CarreraTipo } from './carrerraTipo.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { EstadoInstitucionEductivaTipo } from './estadoInstitucionEducativaTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { InstitucionEducativaAcreditacionEspecialidad } from './institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { JurisdiccionGeografica } from './jurisdiccionGeografica.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { Operativo } from './operativo.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';

@Entity({ name: 'instituto_plan_estudio_carrera', schema: 'public' })
export class InstitutoPlanEstudioCarrera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;

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

  @Column({ name: 'carrera_autorizada_id', nullable:false })
  carreraAutorizadaId: number;

  @ManyToOne(() => CarreraAutorizada, (carreraAutorizada) => carreraAutorizada.institutosPlanesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_autorizada_id', referencedColumnName: 'id'})
  carreraAutorizada: CarreraAutorizada;

  @Column({ type: 'integer', name: 'plan_estudio_carrera_id' })
  planEstudioCarreraId: number;

  @ManyToOne(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.institutosPlanesCarreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'plan_estudio_carrera_id', referencedColumnName: 'id'})
  planEstudioCarrera: PlanEstudioCarrera;
  
}
