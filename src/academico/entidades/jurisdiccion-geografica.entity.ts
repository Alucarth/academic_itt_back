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
import { EducacionTipo } from './educacion_tipo.entity';
import { InstitucionEducativa } from './institucion-educativa.entity';

@Entity({ name: 'jurisdiccion_geografica', schema: 'public' })
export class JurisdiccionGeografica {
  @PrimaryGeneratedColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1

  @Column({ type: 'integer', name: 'codigo_edificio_educativo' })
  codigoEdificioEducativ: number;

  @Column({ type: 'varchar', name: 'nombre_edificio_educativo' })
  nombreEdificioEducativo: string;

  @Column({ type: 'varchar', name: 'direccion' })
  direccion: string;

  @Column({ type: 'varchar', name: 'zona' })
  zona: string;

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
  uduarioId: number;

  @OneToMany(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.jurisdiccionGeografica)
  instituciones: InstitucionEducativa[];
}
