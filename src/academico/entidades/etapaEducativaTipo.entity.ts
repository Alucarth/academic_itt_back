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
import { EtapaEducativa } from './etapaEducativa.entity';
import { SistemaEducacionTipo } from './sistemaEducacionTipo.entity';

@Entity({ name: 'etapa_educativa_tipo', schema: 'public' })
export class EtapaEducativaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'etapa_educativa' })
  etapaEducativa: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Column({ type: 'varchar', name: 'parentesco' })
  parentesco: string;

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

  @Column({ type: 'integer', name: 'educacion_tipo_id' })
  educacionTipoId: number;

  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => SistemaEducacionTipo, (sistemaEducacionTipo) => sistemaEducacionTipo.educacionTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  sistemaEducacionTipo: SistemaEducacionTipo;

  @OneToMany(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.etapaEducativaTipo)
  etapasEducativas: EtapaEducativa[];
  
}
