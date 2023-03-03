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
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { Operativo } from './operativo.entity';

@Entity({ name: 'periodo_tipo', schema: 'public' })
export class PeriodoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'periodo' })
  periodo: string;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;
    
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

  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.periodos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @OneToMany(() => Operativo, (operativo) => operativo.periodoTipo)
  operativos: Operativo[];
  
  @OneToMany(() => InstitucionEducativaCurso, (InstitucionEducativaCurso) => InstitucionEducativaCurso.periodoTipo)
  cursos: InstitucionEducativaCurso[];
  
}
