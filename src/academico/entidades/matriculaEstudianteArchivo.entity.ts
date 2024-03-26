import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatriculaEstudiante } from "./matriculaEstudiante.entity";
import { ArchivoTipo } from "./archivoTipo.entity";
import { Exclude } from "class-transformer";
import { GestionTipo } from "./gestionTipo.entity";

@Entity({ name: 'matricula_estudiante_archivo', schema: 'public' })
export class MatriculaEstudianteArchivo {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar', name: 'descripcion' })
    descripcion: string;

    @Column({ type: 'integer', name: 'matricula_estudiante_id' })
    matriculaEstudianteId: number;

    @ManyToOne(() => MatriculaEstudiante, (matricula_estuduante) => matricula_estuduante.id, { nullable: false, cascade: true })
    @JoinColumn({ name: 'matricula_estudiante_id', referencedColumnName: 'id'})
    matriculaEstudiante: MatriculaEstudiante;

    @Column({ type: 'integer', name: 'gestion_tipo_id' })
    gestionTipoId: number;

    @ManyToOne(() => GestionTipo, (gestion_tipo) => gestion_tipo.id, { nullable: false, cascade: true })
    @JoinColumn({ name: 'gestion_tipo_id', referencedColumnName: 'id'})
    gestionTipo: GestionTipo;

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