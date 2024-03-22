import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InstitutoEstudianteInscripcion } from "./InstitutoEstudianteInscripcion.entity";
import { Exclude } from "class-transformer";
import { ArchivoTipo } from "./archivoTipo.entity";

@Entity({ name:'instituto_estudiante_inscripcion_archivo', schema: 'public' })
export class InstitutoEstudianteInscripcionArchivo{
    
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar', name: 'descripcion' })
    descripcion: string;

    @Column({ type: 'integer', name: 'instituto_estudiante_inscripcion_id' })
    institutoEstudianteInscripcionId: number;

    @ManyToOne(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.inscripcionesDocentesCalificaciones, { nullable: false, cascade: true })
    @JoinColumn({ name: 'instituto_estudiante_inscripcion_id', referencedColumnName: 'id'})
    institutoEstudianteInscripcion: InstitutoEstudianteInscripcion;

    @Column({ type: 'integer', name: 'archivo_tipo_id' })
    archivoTipoId: number;

    @ManyToOne(() => ArchivoTipo, (archivoTipo) => archivoTipo.id)
    @JoinColumn({ name: 'archivo_tipo_id', referencedColumnName: 'id'})
    archivoTipo: ArchivoTipo;

    @Column({ type: 'varchar', name: 'url_path' })
    urlPath: string;

    @Exclude()
    @CreateDateColumn({
      name: 'fecha_registro',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaRegistro: Date;

    @Column({ type: 'integer', name: 'usuario_id' })
    usuarioId: number;

}