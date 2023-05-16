import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InstitutoEstudianteInscripcion } from "./InstitutoEstudianteInscripcion";
import { GestionTipo } from "./GestionTipo";
import { InstitucionEducativaEstudiante } from "./InstitucionEducativaEstudiante";
import { PeriodoTipo } from "./PeriodoTipo";
import { PlanEstudioCarrera } from "./PlanEstudioCarrera";

@Index("matricula_estudiante_pk", ["id"], { unique: true })
@Entity("matricula_estudiante", { schema: "public" })
export class MatriculaEstudiante {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "doc_matricula",
    nullable: true,
    length: 100,
  })
  docMatricula: string | null;

  @Column("timestamp without time zone", { name: "fecha_registro" })
  fechaRegistro: Date;

  @Column("timestamp without time zone", {
    name: "fecha_modificacion",
    nullable: true,
  })
  fechaModificacion: Date | null;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @OneToMany(
    () => InstitutoEstudianteInscripcion,
    (institutoEstudianteInscripcion) =>
      institutoEstudianteInscripcion.matriculaEstudiante
  )
  institutoEstudianteInscripcions: InstitutoEstudianteInscripcion[];

  @ManyToOne(
    () => GestionTipo,
    (gestionTipo) => gestionTipo.matriculaEstudiantes
  )
  @JoinColumn([{ name: "gestion_tipo_id", referencedColumnName: "id" }])
  gestionTipo: GestionTipo;

  @ManyToOne(
    () => InstitucionEducativaEstudiante,
    (institucionEducativaEstudiante) =>
      institucionEducativaEstudiante.matriculaEstudiantes
  )
  @JoinColumn([
    { name: "institucion_educativa_estudiante_id", referencedColumnName: "id" },
  ])
  institucionEducativaEstudiante: InstitucionEducativaEstudiante;

  @ManyToOne(
    () => PeriodoTipo,
    (periodoTipo) => periodoTipo.matriculaEstudiantes
  )
  @JoinColumn([{ name: "periodo_tipo_id", referencedColumnName: "id" }])
  periodoTipo: PeriodoTipo;

  @ManyToOne(
    () => PlanEstudioCarrera,
    (planEstudioCarrera) => planEstudioCarrera.matriculaEstudiantes
  )
  @JoinColumn([{ name: "plan_estudio_carrera_id", referencedColumnName: "id" }])
  planEstudioCarrera: PlanEstudioCarrera;
}
