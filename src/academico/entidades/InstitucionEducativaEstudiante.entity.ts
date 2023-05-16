import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InstitucionEducativaSucursal } from "./institucionEducativaSucursal.entity";
import { Persona } from "../entidades/persona.entity";
import { MatriculaEstudiante } from "./matriculaEstudiante.entity";

@Index("registro_estudiante_pk", ["id"], { unique: true })
@Entity("institucion_educativa_estudiante", { schema: "public" })
export class InstitucionEducativaEstudiante {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "observacion", length: 150 })
  observacion: string;

  @Column("character varying", { name: "codigo_estudiante", length: 150 })
  codigoEstudiante: string;

  @Column("timestamp without time zone", { name: "fecha_registro" })
  fechaRegistro: Date;

  @Column("timestamp without time zone", {
    name: "fecha_modificacion",
    nullable: true,
  })
  fechaModificacion: Date | null;

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @ManyToOne(
    () => InstitucionEducativaSucursal,
    (institucionEducativaSucursal) =>
      institucionEducativaSucursal.institucionEducativaEstudiantes
  )
  @JoinColumn([
    { name: "institucion_educativa_sucursal_id", referencedColumnName: "id" },
  ])
  institucionEducativaSucursal: InstitucionEducativaSucursal;

  @ManyToOne(
    () => Persona,
    (persona) => persona.institucionEducativaEstudiantes
  )
  @JoinColumn([{ name: "persona_id", referencedColumnName: "id" }])
  persona: Persona;

  @OneToMany(
    () => MatriculaEstudiante,
    (matriculaEstudiante) => matriculaEstudiante.institucionEducativaEstudiante
  )
  matriculaEstudiantes: MatriculaEstudiante[];
}
