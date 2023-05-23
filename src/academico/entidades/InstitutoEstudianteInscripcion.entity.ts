import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Aula } from "./aula.entity";

import { EstadoMatriculaTipo } from "./estadoMatriculaTipo.entity";
import { InstitutoEstudianteInscripcionDocenteCalificacion } from "./institutoEstudianteInscripcionDocenteCalificacion.entity";
import { MatriculaEstudiante } from "./matriculaEstudiante.entity";
import { OfertaCurricular } from "./ofertaCurricular.entity";


@Index("instituto_estudiante_inscripcion_pk", ["id"], { unique: true })
@Entity("instituto_estudiante_inscripcion", { schema: "public" })
export class InstitutoEstudianteInscripcion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  /*@Column("smallint", { name: "estadomatricula_inicio_tipo_id" })
  estadomatriculaInicioTipoId: number;*/

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

  @Column("integer", { name: "aula_id" })
  aulaId: number;

  @ManyToOne(() => Aula, (aula) => aula.institutoEstudianteInscripcions)
  @JoinColumn([{ name: "aula_id", referencedColumnName: "id" }])
  aula: Aula;

  @Column("integer", { name: "oferta_curricular_id" })
  ofertaCurricularId: number;

  @ManyToOne(() => OfertaCurricular, (ofertaCurricular) => ofertaCurricular.institutoEstudianteInscripcions)
  @JoinColumn([{ name: "oferta_curricular_id", referencedColumnName: "id" }])
  ofertaCurricular: OfertaCurricular;

  @Column("integer", { name: "estadomatricula_tipo_id" })
  estadoMatriculaTipoId: number;

  @ManyToOne(
    () => EstadoMatriculaTipo,
    (estadoMatriculaTipo) => estadoMatriculaTipo.institutoEstudianteInscripcions
  )
  @JoinColumn([{ name: "estadomatricula_tipo_id", referencedColumnName: "id" }])
  estadoMatriculaTipo: EstadoMatriculaTipo;

  @Column("integer", { name: "estadomatricula_inicio_tipo_id" })
  estadoMatriculaInicioTipoId: number;

  /*@ManyToOne(
    () => EstadoMatriculaTipo,
    (estadoMatriculaTipo) => estadoMatriculaTipo.institutoEstudianteInscripcionsInicio
  )
  @JoinColumn([{ name: "estadomatricula_inicio_tipo_id", referencedColumnName: "id" }])
  estadoMatriculaInicioTipo: EstadoMatriculaTipo;*/

  @Column("integer", { name: "matricula_estudiante_id" })
  matriculaEstudianteId: number;

  @ManyToOne(
    () => MatriculaEstudiante,
    (matriculaEstudiante) => matriculaEstudiante.institutoEstudianteInscripcions
  )
  @JoinColumn([{ name: "matricula_estudiante_id", referencedColumnName: "id" }])
  matriculaEstudiante: MatriculaEstudiante;
 
  @OneToMany(() => InstitutoEstudianteInscripcionDocenteCalificacion, (institutoEstudianteInscripcionDocenteCalificacion) => institutoEstudianteInscripcionDocenteCalificacion.institutoEstudianteInscripcion)
  inscripcionesDocentesCalificaciones: InstitutoEstudianteInscripcionDocenteCalificacion[];  
  

}
