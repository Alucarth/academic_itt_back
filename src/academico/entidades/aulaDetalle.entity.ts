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
import { Aula } from './aula.entity';
import { DiaTipo } from './diaTipo.entity';

@Entity({ name: 'aula_detalle', schema: 'public' })
export class AulaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'hora_inicio' })
  horaInicio: string;

  @Column({ type: 'varchar', name: 'hora_fin' })
  horaFin: string;

  @Column({ type: 'varchar', name: 'numero_aula' })
  numeroAula: string;

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

  @Column({ type: 'integer', name: 'aula_id' })
  aulaId: number;

  @ManyToOne(() => Aula, (aula) => aula.aulasDetalles, { nullable: false, cascade: true })
  @JoinColumn({ name: 'aula_id', referencedColumnName: 'id'})
  aula: Aula;
}
