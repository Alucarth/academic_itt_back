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
import { EtapaEducativaAsignaturaNivelAcademico } from './etapaEducativaAsignaturaNivelAcademico.entity';
import { GestionTipo } from './gestionTipo.entity';
import { InstitucionEducativaAcreditacionEspecialidadNivelAcademico } from './institucionEducativaAcreditacionEspecialidadNivelAcademico.entity';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { TramiteInstitucionEducativa } from './tramiteInstitucionEducativa.entity';
import { TramiteTarea } from './tramiteTarea.entity';
import { TramiteTipo } from './tramiteTipo.entity';


@Entity({ name: 'tramite', schema: 'public' })
export class Tramite {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'tramite' })
  tramite: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;

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

  @ManyToOne(() => TramiteTipo, (tramiteTipo) => tramiteTipo.tramites, { nullable: false, cascade: true })
  @JoinColumn({ name: 'tramite_tipo_id', referencedColumnName: 'id'})
  tramiteTipo: TramiteTipo;

  @ManyToOne(() => GestionTipo, (gestionTipo) => gestionTipo.tramites, { nullable: false, cascade: true })
  @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
  gestionTipo: GestionTipo;

  @OneToMany(() => TramiteTarea, (tramiteTarea) => tramiteTarea.tramite)
  tramitesTareas: TramiteTarea[];
  
  @OneToMany(() => TramiteInstitucionEducativa, (tramiteInstitucionEducativa) => tramiteInstitucionEducativa.tramite)
  tramitesInstituciones: TramiteInstitucionEducativa[];

}
