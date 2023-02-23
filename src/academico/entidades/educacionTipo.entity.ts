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
import { EtapaEducativa } from './etapaEducativa.entity';
import { InstitucionEducativa } from './institucionEducativa.entity';
import { PlanEstudio } from './planEstudio.entity';
import { SistemaEducacionTipo } from './sistemaEducacionTipo.entity';

@Entity({ name: 'educacion_tipo', schema: 'public' })
export class EducacionTipo {
  @PrimaryGeneratedColumn()
  id: number;

  //jurisdiccion_geografica_id * a 1

  @Column({ type: 'varchar', name: 'educacion' })
  educacion: string;

  @Column({name:'activo', type: 'bool', default: true })
  activo: boolean;
    
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

  @ManyToOne(() => SistemaEducacionTipo, (sistemaEducacionTipo) => sistemaEducacionTipo.educacionTipos, { nullable: false, cascade: true })
  @JoinColumn({ name: 'sistema_educacion_tipo_id', referencedColumnName: 'id'})
  sistemaEducacionTipo: SistemaEducacionTipo;

  @OneToMany(() => InstitucionEducativa, (institucionEducativa) => institucionEducativa.educacionTipo)
  instituciones: InstitucionEducativa[];
  
  @OneToMany(() => EtapaEducativa, (etapaEducativa) => etapaEducativa.educacionTipo)
  etapasEducativas: EtapaEducativa[];
  
  @OneToMany(() => PlanEstudio, (planEstudio) => planEstudio.educacionTipo)
  planesEstudios: PlanEstudio[];
  
}
