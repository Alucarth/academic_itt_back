import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Aula } from "./A";
import { EstadoMatriculaTipo } from "./estadoMatriculaTipo.entity";
import { MatriculaEstudiante } from "./MatriculaEstudiante";
import { OfertaCurricular } from "./OfertaCurricular";

@Index("instituto_estudiante_inscripcion_pk", ["id"], { unique: true })
@Entity("instituto_estudiante_inscripcion", { schema: "public" })
export class InstitutoEstudianteInscripcion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("smallint", { name: "estadomatricula_inicio_tipo_id" })
  estadomatriculaInicioTipoId: number;

  @Column("character varying", {
    name: "observacion",
    nullable: true,
    length: 255,
  })
  observacion: string | null;

  @Column("date", { name: "fecha_inscripcion" })
  fechaInscripcion: string;

  @Column("timestamp without time zone", { name: "fecha_registro" })
  fechaRegistro: Date;

  @Column("timestamp without time zone", {
    name: "fecha_modificacion",
    nullable: true,
  })
  fechaModificacion: Date | null;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @ManyToOne(() => Aula, (aula) => aula.institutoEstudianteInscripcions)
  @JoinColumn([{ name: "aula_id", referencedColumnName: "id" }])
  aula: Aula;

  @ManyToOne(
    () => EstadoMatriculaTipo,
    (estadoMatriculaTipo) => estadoMatriculaTipo.institutoEstudianteInscripcions
  )
  @JoinColumn([{ name: "estadomatricula_tipo_id", referencedColumnName: "id" }])
  estadomatriculaTipo: EstadoMatriculaTipo;

  @ManyToOne(
    () => MatriculaEstudiante,
    (matriculaEstudiante) => matriculaEstudiante.institutoEstudianteInscripcions
  )
  @JoinColumn([{ name: "matricula_estudiante_id", referencedColumnName: "id" }])
  matriculaEstudiante: MatriculaEstudiante;

  @ManyToOne(
    () => OfertaCurricular,
    (ofertaCurricular) => ofertaCurricular.institutoEstudianteInscripcions
  )
  @JoinColumn([{ name: "oferta_curricular_id", referencedColumnName: "id" }])
  ofertaCurricular: OfertaCurricular;
}
