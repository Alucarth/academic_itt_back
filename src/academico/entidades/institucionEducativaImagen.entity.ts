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
import { InstitucionEducativa } from './institucionEducativa.entity';

@Entity({ name: 'institucion_educativa_imagen', schema: 'public' })
export class InstitucionEducativaImagen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'nombre_archivo' })
  nombreArchivo: string;

  @Column({ type: 'varchar', name: 'imagen_tipo' })
  imagenTipo: string;

  @Column({ type: 'varchar', name: 'descripcion' })
  descripcion: string;

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

  @Column({ type: 'integer', name: 'institucion_educativa_id' })
  institucionEducativaId: number;

  @ManyToOne(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.imagenes, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_id', referencedColumnName: 'id'})
  institucionEducativa: InstitucionEducativa;

}
