import { RegimenGradoTipo } from './regimeGradoTipo.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InstitutoPlanEstudioCarrera } from "./institutoPlanEstudioCarrera.entity";
import { InstitutoEstudianteInscripcion } from "./InstitutoEstudianteInscripcion.entity";
import { InstitutoEstudianteInscripcionDocenteCalificacion } from "./institutoEstudianteInscripcionDocenteCalificacion.entity";
import { User } from "src/users/entity/users.entity";
import { EstadoMatriculaTipo } from './estadoMatriculaTipo.entity';
import { Exclude } from 'class-transformer';

@Entity("homologados_gestion_estudiante",{ schema: 'public'})
export class HomologadosGestionEstudiante{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'from_instituto_plan_estudio_carrera_id', nullable:false })
    fromInstitutoPlanEstudioCarreraId: number;

    @ManyToOne(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.id)
    @JoinColumn({ name: "from_instituto_plan_estudio_carrera_id", referencedColumnName: "id" })
    fromInstitutoPlanEstudioCarrera: InstitutoPlanEstudioCarrera;

    @Column({ name: 'to_instituto_plan_estudio_carrera_id', nullable:false })
    toInstitutoPlanEstudioCarreraId: number;

    @ManyToOne(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.id)
    @JoinColumn({ name: "to_instituto_plan_estudio_carrera_id", referencedColumnName: "id" })
    toInstitutoPlanEstudioCarrera: InstitutoPlanEstudioCarrera;

    @Column({ name: 'instituto_estudiante_inscripcion_id', nullable:false })
    institutoEstudianteInscripcionId: number;

    @ManyToOne(() => InstitutoEstudianteInscripcion, (institutoEstudianteInscripcion) => institutoEstudianteInscripcion.id)
    @JoinColumn({ name: "instituto_estudiante_inscripcion_id", referencedColumnName: "id" })
    institutoEstudianteInscripcion: InstitutoEstudianteInscripcion;

    @Column({ name: 'instituto_estudiante_inscripcion_docente_calificacion_id', nullable:false })
    institutoEstudianteInscripcionDocenteCalificacionId: number;

    @ManyToOne(() => InstitutoEstudianteInscripcionDocenteCalificacion, (institutoEstudianteInscripcionDocenteCalificacion) => institutoEstudianteInscripcionDocenteCalificacion.id)
    @JoinColumn({ name: "instituto_estudiante_inscripcion_docente_calificacion_id", referencedColumnName: "id" })
    institutoEstudianteInscripcionDocenteCalificacion: InstitutoEstudianteInscripcionDocenteCalificacion;

    @Column({ name: 'regimen_grado_tipo_id', nullable:false })
    regimenGradoTipoId: number;

    @ManyToOne(() => RegimenGradoTipo, (regimenGrado) => regimenGrado.id)
    @JoinColumn({ name: "regimen_grado_tipo_id", referencedColumnName: "id" })
    regimenGradoTipo: InstitutoPlanEstudioCarrera;


    @Column({ name: 'to_estado_matricula_tipo_id', nullable:false })
    toEstadoMatriculaTipoId: number;

    @ManyToOne(() => EstadoMatriculaTipo, (estadoMatriculaTipo) => estadoMatriculaTipo.id)
    @JoinColumn({ name: "to_estado_matricula_tipo_id", referencedColumnName: "id" })
    toEstadoMatriculaTipo: EstadoMatriculaTipo;

    @Column({ name: 'usuario_id', nullable:false })
    userId: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: "usuario_id", referencedColumnName: "id" })
    user: User;

    @Column({ name: 'index_sort', nullable:false })
    indexSort: number;

    @Exclude()
    @CreateDateColumn({
      name: 'fecha_registro',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    fechaRegistro: Date;
   
}