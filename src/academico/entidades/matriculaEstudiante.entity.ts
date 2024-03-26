import { Exclude } from "class-transformer";
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
import { GestionTipo } from "./gestionTipo.entity";
import { InstitucionEducativaEstudiante } from "./InstitucionEducativaEstudiante.entity";
import { InstitutoEstudianteInscripcion } from "./InstitutoEstudianteInscripcion.entity";
import { InstitutoPlanEstudioCarrera } from "./institutoPlanEstudioCarrera.entity";
import { PeriodoTipo } from "./periodoTipo.entity";
import { PlanEstudioCarrera } from "./planEstudioCarrera.entity";
import { EstadoInstituto } from "./estadoInstituto.entity";


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
  @JoinColumn({ name: "gestion_tipo_id", referencedColumnName: "id" })
  gestionTipo: GestionTipo;

  @Column({name: 'institucion_educativa_estudiante_id'})
  institucionEducativaEstudianteId:number

  @ManyToOne(
    () => InstitucionEducativaEstudiante,
    (institucionEducativaEstudiante) => institucionEducativaEstudiante.matriculaEstudiantes
  )
  //se comento por que generaba un error de no encontrar la columna --->"institucionEducativaEstudianteIdId"
  // @Column("integer", { name: "institucion_educativa_estudiante_id" })
  // institucionEducativaEstudianteId: number;
  
  @JoinColumn(
    { name: "institucion_educativa_estudiante_id", referencedColumnName: 'id' },
   )
  institucionEducativaEstudiante: InstitucionEducativaEstudiante;

  @ManyToOne(
    () => PeriodoTipo,
    (periodoTipo) => periodoTipo.matriculaEstudiantes
  )
  @JoinColumn({ name: "periodo_tipo_id", referencedColumnName: "id" })
  periodoTipo: PeriodoTipo;

  @ManyToOne(
    () => PlanEstudioCarrera,
    (planEstudioCarrera) => planEstudioCarrera.matriculaEstudiantes
  )
  @JoinColumn({ name: "plan_estudio_carrera_id", referencedColumnName: "id" })
  planEstudioCarrera: PlanEstudioCarrera;

  @Column({ name: 'instituto_plan_estudio_carrera_id', nullable:false })
  institutoPlanEstudioCarreraId: number;

  @ManyToOne(() => InstitutoPlanEstudioCarrera, (institutoPlanEstudioCarrera) => institutoPlanEstudioCarrera.matriculasEstudiantes, { nullable: false, cascade: true })
  @JoinColumn({ name: "instituto_plan_estudio_carrera_id", referencedColumnName: "id" })
  institutoPlanEstudioCarrera: InstitutoPlanEstudioCarrera;

  @Column({type: 'integer', nullable:true , name: "estado_instituto_id" })
  estadoInstitutoId: number;

  @ManyToOne(() => EstadoInstituto, (estadoInstitutoId) => estadoInstitutoId.id)
  @JoinColumn([{ name: "estado_instituto_id", referencedColumnName: "id" }])
  estadoInstituto: EstadoInstituto;
  
}
