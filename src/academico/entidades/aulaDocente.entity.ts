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
import { BajaTipo } from './bajaTipo.entity';
import { DiaTipo } from './diaTipo.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from './institutoEstudianteInscripcionDocenteCalificacion.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';

@Entity({ name: 'aula_docente', schema: 'public' })
export class AulaDocente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', name: 'asignacion_fecha_inicio' })
  asignacionFechaInicio: string;

  @Column({ type: 'date', name: 'asignacion_fecha_fin' })
  asignacionFechaFin: string;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;
  
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
 
  @Column({ type: 'integer', name: 'aula_id' })
  aulaId: number;

  @ManyToOne(() => Aula, (aula) => aula.aulasDocentes, { nullable: false, cascade: true })
  @JoinColumn({ name: 'aula_id', referencedColumnName: 'id'})
  aula: Aula;

  @Column({ type: 'integer', name: 'maestro_inscripcion_id' })
  maestroInscripcionId: number;

  @ManyToOne(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.aulasDocentes, { nullable: false, cascade: true })
  @JoinColumn({ name: 'maestro_inscripcion_id', referencedColumnName: 'id'})
  maestroInscripcion: MaestroInscripcion;

  @Column({ type: 'integer', name: 'baja_tipo_id' })
  bajaTipoId: number;

  @ManyToOne(() => BajaTipo, (bajaTipo) => bajaTipo.aulasDocentes, { nullable: false, cascade: true })
  @JoinColumn({ name: 'baja_tipo_id', referencedColumnName: 'id'})
  bajaTipo: BajaTipo;

  @OneToMany(() => InstitutoEstudianteInscripcionDocenteCalificacion, (institutoEstudianteInscripcionDocenteCalificacion) => institutoEstudianteInscripcionDocenteCalificacion.aulaDocente)
  inscripcionesDocentesCalificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[];  
  
}
