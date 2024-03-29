import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AreaTipo } from './areaTipo.entity';
import { CarreraAutorizadaResolucion } from './carreraAutorizadaResolucion.entity';
import { CarreraTipo } from './carrerraTipo.entity';
import { InstitucionEducativaSucursal } from './institucionEducativaSucursal.entity';
import { InstitutoPlanEstudioCarrera } from './institutoPlanEstudioCarrera.entity';
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { OperativoCarreraAutorizada } from './operativoCarreraAutorizada.entity';

@Entity({ name: 'carrera_autorizada', schema: 'public' })
export class CarreraAutorizada {
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

  @Column({ type: 'boolean', name: 'activo' })
  activo: boolean;

  @Column({ type: 'integer', name: 'usuario_id' })
  usuarioId: number;
  
  @Column({ name: 'institucion_educativa_sucursal_id', nullable:false })
  institucionEducativaSucursalId: number;

  @ManyToOne(() => InstitucionEducativaSucursal, (institucionEducativaSucursal) => institucionEducativaSucursal.carreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_sucursal_id', referencedColumnName: 'id'})
  institucionEducativaSucursal: InstitucionEducativaSucursal;

  @Column({ name: 'carrera_tipo_id', nullable:false })
  carreraTipoId: number;

  @ManyToOne(() => CarreraTipo, (carreraTipo) => carreraTipo.carreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'carrera_tipo_id', referencedColumnName: 'id'})
  carreraTipo: CarreraTipo;

  @Column({ name: 'area_tipo_id', nullable:false })
  areaTipoId: number;

  @ManyToOne(() => AreaTipo, (areaTipo) => areaTipo.carreras, { nullable: false, cascade: true })
  @JoinColumn({ name: 'area_tipo_id', referencedColumnName: 'id'})
  areaTipo: AreaTipo;

  @OneToMany(() => CarreraAutorizadaResolucion, (carreraAutorizadaResolucion) => carreraAutorizadaResolucion.carreraAutorizada)
  resoluciones: CarreraAutorizadaResolucion[];

  @OneToMany(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.carreraAutorizada)
  institutosPlanesCarreras: InstitutoPlanEstudioCarrera[];

  @OneToMany(() => OperativoCarreraAutorizada, (operativoCarreraAutorizada) => operativoCarreraAutorizada.carreraAutorizada)
  operativosCarreras: OperativoCarreraAutorizada[];

  @DeleteDateColumn()  //soft delete
  deleted_at: Date; // Deletion date 

}
