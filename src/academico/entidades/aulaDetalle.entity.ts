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
import { DiaTipo } from './diaTipo.entity';
import { EtapaEducativa } from './etapaEducativa.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { Operativo } from './operativo.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';
import { PlanEstudio } from './planEstudio.entity';
import { SistemaEducacionTipo } from './sistemaEducacionTipo.entity';

@Entity({ name: 'aula_detalle', schema: 'public' })
export class AulaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'hora_inicio' })
  horaInicio: string;

  @Column({ type: 'varchar', name: 'hora_fin' })
  horaFin: string;

  @Column({ type: 'varchar', name: 'aula' })
  aula: string;

  @Column({ type: 'varchar', name: 'observacion' })
  observacion: string;
  
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
 
  @Column({ type: 'integer', name: 'dia_tipo_id' })
  diaTipoId: number;

  @ManyToOne(() => DiaTipo, (diaTipo) => diaTipo.aulasDetalles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'dia_tipo_id', referencedColumnName: 'id'})
  diaTipo: DiaTipo;
}
