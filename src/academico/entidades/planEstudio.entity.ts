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
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';

@Entity({ name: 'plan_estudio', schema: 'public' })
export class PlanEstudio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'documento_numero' })
  documentoNumero: string;

  @Column({ type: 'varchar', name: 'documento_url' })
  documentoUrl: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
    
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

  @Column({ type: 'integer', name: 'usuario_id' })
  asignaturaId: number;

  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.planesEstudios, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;
  
  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.planesEstudios, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @OneToMany(() => EtapaEducativaAsignatura, (etapaEducativaAsignatura) => etapaEducativaAsignatura.planEstudio)
  etapasEducativasAsignaturas: EtapaEducativaAsignatura[];
}
