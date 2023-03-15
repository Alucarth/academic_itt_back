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
import { InstitucionEducativa } from './institucionEducativa.entity';
import { Tramite } from './tramite.entity';


@Entity({ name: 'tramite_institucion_educativa', schema: 'public' })
export class TramiteInstitucionEducativa {

  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Tramite, (tramite) => tramite.tramitesInstituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'tramite_id', referencedColumnName: 'id'})
  tramite: Tramite;

  @ManyToOne(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.tramitesInstituciones, { nullable: false, cascade: true })
  @JoinColumn({ name: 'institucion_educativa_id', referencedColumnName: 'id'})
  institucionEducativa: InstitucionEducativa;

}
