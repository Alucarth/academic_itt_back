import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pais_tipo', schema: 'public' })
export class PaisTipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'pais' })
  pais: string;

  @Column({ type: 'varchar', name: 'desc_abreviacion' })
  descAbreviacion: string;
    
  
  
}
