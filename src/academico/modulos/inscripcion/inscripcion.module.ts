import { Module } from '@nestjs/common';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { RespuestaSigedService } from "src/shared/respuesta.service";

import { PersonaService } from "src/academico/modulos/persona/persona.service";
import { PersonaModule } from '../persona/persona.module';

import { MatriculaEstudiante } from "../../entidades/matriculaEstudiante.entity";
import { InstitucionEducativaEstudiante } from "../../entidades/InstitucionEducativaEstudiante.entity";
import { InstitutoEstudianteInscripcion } from "../../entidades/InstitutoEstudianteInscripcion.entity";
import { InstitucionEducativaSucursal } from "../../entidades/institucionEducativaSucursal.entity";
import { GestionTipo } from "../../entidades/gestionTipo.entity";
import { PeriodoTipo } from "../../entidades/periodoTipo.entity";
import { PlanEstudioCarrera } from "../../entidades/planEstudioCarrera.entity";
import { Aula } from "../../entidades/aula.entity";
import { EstadoMatriculaTipo } from "../../entidades/estadoMatriculaTipo.entity";
import { OfertaCurricular } from "../../entidades/ofertaCurricular.entity";
import { UsersModule } from "../../../users/users.module";
import { InstitutoPlanEstudioCarrera } from "../../entidades/institutoPlanEstudioCarrera.entity";
import { OperativoCarreraAutorizadaModule } from "../operativo_carrera_autorizada/operativo_carrera_autorizada.module"
import { TblAuxiliarSie } from 'src/academico/entidades/tblAuxiliarSie';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { UsuarioRol } from 'src/users/entity/usuarioRol.entity';
import { UsuarioRolInstitucionEducativa } from 'src/academico/entidades/usuarioRolInsituticionEducativa.entity';
import { User } from 'src/users/entity/users.entity';
import { Persona } from 'src/users/entity/persona.entity';
@Module({
  imports: [
    OperativoCarreraAutorizadaModule,
    UsersModule,
    DatabaseModule,
    PersonaModule,
    TypeOrmModule.forFeature([MatriculaEstudiante]),
    TypeOrmModule.forFeature([InstitucionEducativaEstudiante]),
    TypeOrmModule.forFeature([InstitutoEstudianteInscripcion]),
    TypeOrmModule.forFeature([InstitucionEducativaSucursal]),
    TypeOrmModule.forFeature([GestionTipo]),
    TypeOrmModule.forFeature([PeriodoTipo]),
    TypeOrmModule.forFeature([PlanEstudioCarrera]),
    TypeOrmModule.forFeature([EstadoMatriculaTipo]),
    TypeOrmModule.forFeature([Aula]),
    TypeOrmModule.forFeature([OfertaCurricular]),
    TypeOrmModule.forFeature([InstitutoPlanEstudioCarrera,InstitutoEstudianteInscripcionDocenteCalificacion,UsuarioRol,UsuarioRolInstitucionEducativa,User, Persona]),
    TypeOrmModule.forFeature([TblAuxiliarSie], "siedb"),
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService,
     RespuestaSigedService],
})
export class InscripcionModule {}
