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
import { MaestroInscripcion } from './maestroInscripcion.entity';
import { EducacionTipo } from './educacionTipo.entity';
import { UnidadTerritorialUsuarioRolApp } from './unidadTerritorialUsuarioRolApp.entity';

@Entity({ name: 'app_tipo', schema: 'public' })
export class AppTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'url_sistema' })
  urlSistema: string;

  @Column({ type: 'varchar', name: 'comentario' })
  comentario: string;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_inicio',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaInicio: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'fecha_fin',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaFin: Date;
  
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
  
  @ManyToOne(() => EducacionTipo, (educacionTipo) => educacionTipo.etapasEducativas, { nullable: false, cascade: true })
  @JoinColumn({ name: 'educacion_tipo_id', referencedColumnName: 'id'})
  educacionTipo: EducacionTipo;

  @OneToMany(() => UnidadTerritorialUsuarioRolApp, (unidadTerritorialUsuarioRolApp) => unidadTerritorialUsuarioRolApp.appTipo)
  unidadesTerritorialesUsuariosRolesApps: UnidadTerritorialUsuarioRolApp[];

}
