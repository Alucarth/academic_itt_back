import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { MatriculaEstudiante } from './matriculaEstudiante.entity';
import { OfertaCurricular } from './ofertaCurricular.entity';
import { Operativo } from './operativo.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';
import { Tramite } from './tramite.entity';

@Entity({ name: 'gestion_tipo', schema: 'public' })
export class GestionTipo {
  getAll(id: any): GestionTipo | PromiseLike<GestionTipo> {
      throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'gestion' })
  gestion: string;

  @Column({name:'vigente', type: 'bool', default: true })
  vigente: boolean;
    
  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  
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

  @OneToMany(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.gestionTipo)
  sucursales: InstitucionEducativaSucursal[];

  @OneToMany(() => InstitucionEducativaCurso, (institucionEducativaCurso) => institucionEducativaCurso.gestionTipo)
  cursos: InstitucionEducativaCurso[];

  @OneToMany(() => Operativo, (operativo) => operativo.gestionTipo)
  operativos: Operativo[];
  
  @OneToMany(() => MaestroInscripcion, (maestroInscripcion) => maestroInscripcion.gestionTipo)
  maestrosInscripciones: MaestroInscripcion[];

  @OneToMany(() => OperativoEtapaEducativa, (operativoEtapaEducativa) => operativoEtapaEducativa.gestionTipo)
  operativosEtapas: OperativoEtapaEducativa[];

  @OneToMany(() => Tramite, (tramite) => tramite.gestionTipo)
  tramites: Tramite[];

  @OneToMany(() => OfertaCurricular, (ofertaCurricular) => ofertaCurricular.gestionTipo)
  ofertasCurriculares: OfertaCurricular[];

  @OneToMany(() => MatriculaEstudiante, (matriculaEstudiante) => matriculaEstudiante.gestionTipo)
  matriculaEstudiantes: MatriculaEstudiante[];

}

