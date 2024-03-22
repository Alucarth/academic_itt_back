import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'archivo_tipo', schema: 'public'})
export class ArchivoTipo{
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', name: 'nombre' })
    nombre: string;

    @Column({ type: 'varchar', name: 'descripcion' })
    descripcion: string;
  
   
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

}

