import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Operativo } from './operativo.entity';
import { OperativoCarreraAutorizada } from './operativoCarreraAutorizada.entity';
import { OperativoEtapaEducativa } from './operativoEtapaEducativa.entity';

@Entity({ name: 'evento_tipo', schema: 'public' })
export class EventoTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'evento' })
  evento: string;

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
  
  @OneToMany(() => Operativo, (operativo) => operativo.eventoTipo)
  operativos: Operativo[];

  @OneToMany(() => OperativoEtapaEducativa, (operativoEtapaEducativa) => operativoEtapaEducativa.eventoTipo)
  operativosEtapas: OperativoEtapaEducativa[];

  @OneToMany(() => OperativoCarreraAutorizada, (operativoCarreraAutorizada) => operativoCarreraAutorizada.carreraAutorizada)
  operativosCarreras: OperativoCarreraAutorizada[];
  
}
