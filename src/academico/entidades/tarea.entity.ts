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
import { AsignacionTipo } from './asignacionTipo.entity';
import { FlujoTipo } from './flujoTipo.entity';
import { IntervaloTiempoTipo } from './intervaloTiempoTipo.entity';
import { ProcesoTipo } from './procesoTipo.entity';
import { TramiteTarea } from './tramiteTarea.entity';


@Entity({ name: 'tarea', schema: 'public' })
export class Tarea {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'orden' })
  orden: number;

  @Column({ type: 'integer', name: 'plazo' })
  plazo: number;

  @Column({ type: 'varchar', name: 'variable_evaluacion' })
  variableEvaluacion: string;

  @Column({ type: 'varchar', name: 'ruta_formulario' })
  rutaFormulario: string;

  @Column({ type: 'varchar', name: 'ruta_reporte' })
  rutaReporte: string;

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

  @ManyToOne(() => FlujoTipo, (flujoTipo) => flujoTipo.tareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'flujo_tipo_id', referencedColumnName: 'id'})
  flujoTipo: FlujoTipo;

  //@ManyToOne(() => RolTipo, (rolTipo) => rolTipo.tareas, { nullable: true, cascade: true })
  //@JoinColumn({ name: 'flujo_tipo_id', referencedColumnName: 'id'})
  //rolTipo: RolTipo;

  @Column({ type: 'integer', name: 'rol_tipo_id' })
  rolTipoId: number;

  @ManyToOne(() => AsignacionTipo, (asignacionTipo) => asignacionTipo.tareas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'asignacion_tipo_id', referencedColumnName: 'id'})
  asignacionTipo: AsignacionTipo;

  @ManyToOne(() => ProcesoTipo, (procesoTipo) => procesoTipo.tareas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'asignacion_tipo_id', referencedColumnName: 'id'})
  procesoTipo: ProcesoTipo;

  @ManyToOne(() => IntervaloTiempoTipo, (intervaloTiempoTipo) => intervaloTiempoTipo.tareas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_tiempo_tipo_id', referencedColumnName: 'id'})
  intervaloTiempoTipo: IntervaloTiempoTipo;

  @ManyToOne(() => Tarea, (Tarea) => Tarea.anterioresTareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'anterior_tarea_id', referencedColumnName: 'id'})
  anteriorTarea: Tarea;

  @OneToMany(() => Tarea, (tarea) => tarea.procesoTipo)
  anterioresTareas: Tarea[];

  @ManyToOne(() => Tarea, (Tarea) => Tarea.siguientesTareas, { nullable: true, cascade: true })
  @JoinColumn({ name: 'siguiente_tarea_id', referencedColumnName: 'id'})
  siguienteTarea: Tarea;
    
  @OneToMany(() => Tarea, (tarea) => tarea.procesoTipo)
  siguientesTareas: Tarea[];

  @OneToMany(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tarea)
  tramitesTareas: TramiteTarea[];
}
