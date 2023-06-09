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
import { CargoTipo } from './cargoTipo.entity';
import { ConocimientoTipo } from './conocimientoTipo.entity';
import { EspecialidadTipo } from './especialidadTipo.entity';
import { FinanciamientoTipo } from './financiamientoTipo.entity';
import { FormacionTipo } from './formacionTipo.entity';
import { GestionTipo } from './gestionTipo.entity';
import { IdiomaTipo } from './idiomaTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { OfertaAcademicaMaestroInscripcion } from './ofertaAcademicaMaestroInscripcion.entity';
import { PercepcionTipo } from './percepcionTipo.entity';
import { PeriodoTipo } from './periodoTipo.entity';
import { Persona } from './persona.entity';

@Entity({ name: 'maestro_inscripcion_idioma', schema: 'public' })
export class MaestroInscripcionIdioma {
  @PrimaryGeneratedColumn()
  id: number;
 
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

  @ManyToOne(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.maestrosInscripcionesIdiomas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  maestroInscripcion: MaestroInscripcion;

  @ManyToOne(() => ConocimientoTipo, (conocimientoTipo) => conocimientoTipo.maestrosInscripcionesIdiomas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  conocimientoTipo: ConocimientoTipo;
  
 
  @ManyToOne(() => PercepcionTipo, (percepcionTipo) => percepcionTipo.maestrosInscripcionesIdiomas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  percepcionTipo: PercepcionTipo;
 
  @ManyToOne(() => IdiomaTipo, (idiomaTipo) => idiomaTipo.maestrosInscripcionesIdiomas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'persona_id', referencedColumnName: 'id'})
  idiomaTipo: IdiomaTipo;
  
  
}
