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
import { InstitutoEstudianteInscripcionDocenteCalificacion } from './institutoEstudianteInscripcionDocenteCalificacion.entity';
import { IntervaloGestionTipo } from './intervaloGestionTipo.entity';
import { MenuNivelTipo } from './menuNivelTipo.entity';
import { MenuSistema } from './menuSistema.entity';

@Entity({ name: 'nota_tipo', schema: 'public' })
export class NotaTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'nota' })
  nota: string;

  @Column({ type: 'varchar', name: 'abreviacion' })
  abreviacion: string;

  @Column({ type: 'integer', name: 'ordinal' })
  ordinal: number;
  
  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;
  
  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;

  @Column({ type: 'integer', name: 'menu_tipo_id' })
  menuTipoId: number;

  @Column({ type: 'integer', name: 'intervalo_gestion_tipo_id' })
  intervaloGestionTipoId: number;

  @ManyToOne(() => IntervaloGestionTipo, (intervaloGestionTipo) => intervaloGestionTipo.notasTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'intervalo_gestion_tipo_id', referencedColumnName: 'id'})
  intervaloGestionTipo: IntervaloGestionTipo;

  @OneToMany(() => InstitutoEstudianteInscripcionDocenteCalificacion, (institutoEstudianteInscripcionDocenteCalificacion) => institutoEstudianteInscripcionDocenteCalificacion.notaTipo)
  inscripcionesDocentesCalificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[];  
  
}
