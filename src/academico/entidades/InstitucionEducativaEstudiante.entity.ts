import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { InstitucionEducativaSucursal } from "./institucionEducativaSucursal.entity";
import { Persona } from "../entidades/persona.entity";
import { MatriculaEstudiante } from "./matriculaEstudiante.entity";
import { Exclude } from "class-transformer";

@Index("registro_estudiante_pk", ["id"], { unique: true })
@Entity("institucion_educativa_estudiante", { schema: "public" })
export class InstitucionEducativaEstudiante {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "observacion", length: 150 })
  observacion: string;

  @Column("character varying", { name: "codigo_estudiante", length: 150 })
  codigoEstudiante: string;

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

  @Column("integer", { name: "usuario_id" })
  usuarioId: number;

  @Column({name: 'institucion_educativa_sucursal_id'})
  institucionEducativaSucursalId:number
  
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
