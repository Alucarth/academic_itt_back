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
import { CarreraAutorizadaResolucion } from './carreraAutorizadaResolucion.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelIntervalo } from './institucionEducativaAcreditacionEspecialidadNivelIntervalo.entity';
import { NotaTipo } from './notaTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';

import { PlanEstudio } from './planEstudio.entity';
import { PlanEstudioCarrera } from './planEstudioCarrera.entity';

@Entity({ name: 'intervalo_gestion_tipo', schema: 'public' })
export class IntervaloGestionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'intervalo_gestion' })
  intervaloGestion: string;

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

  @OneToMany(() => PlanEstudio, (planEstudio) => planEstudio.intervaloGestionTipo)
  planesEstudios: PlanEstudio[];

  @OneToMany(() => InstitucionEducativaAcreditacionEspecialidadNivelIntervalo, (institucionEducativaAcreditacionEspecialidadNivelIntervalo) => institucionEducativaAcreditacionEspecialidadNivelIntervalo.intervaloGestionTipo)
  especialidadesNivelesIntervalos: InstitucionEducativaAcreditacionEspecialidadNivelIntervalo[];
  
  @OneToMany(() => PeriodoTipo, (PeriodoTipo) => PeriodoTipo.intervaloGestionTipo)
  periodos: PeriodoTipo[];

  @OneToMany(() => CarreraAutorizadaResolucion, (carreraAutorizadaResolucion) => carreraAutorizadaResolucion.carreraAutorizada)
  resoluciones: CarreraAutorizadaResolucion[];
  
  @OneToMany(() => PlanEstudioCarrera, (planEstudioCarrera) => planEstudioCarrera.intervaloGestionTipo)
  planesCarreras: PlanEstudioCarrera[];
  
  @OneToMany(() => NotaTipo, (notaTipo) => notaTipo.intervaloGestionTipo)
  notasTipos: NotaTipo[];
  
}
