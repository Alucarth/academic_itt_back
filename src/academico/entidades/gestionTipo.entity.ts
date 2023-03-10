import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InstitucionEducativaCurso } from './institucionEducativaCurso.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { Operativo } from './operativo.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';

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
}
