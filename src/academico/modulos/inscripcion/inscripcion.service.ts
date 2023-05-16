import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { RespuestaSigedService } from "src/shared/respuesta.service";
import { PersonaService } from "../persona/persona.service";

import { MatriculaEstudiante } from "../../entidades/matriculaEstudiante.entity";
import { InstitucionEducativaEstudiante } from "../../entidades/InstitucionEducativaEstudiante.entity";
import { InstitutoEstudianteInscripcion } from "../../entidades/InstitutoEstudianteInscripcion.entity";
import { InstitucionEducativaSucursal } from "../../entidades/institucionEducativaSucursal.entity";
import { GestionTipo } from "../../entidades/gestionTipo.entity";
import { PeriodoTipo } from "../../entidades/periodoTipo.entity";
import { PlanEstudioCarrera } from "../../entidades/planEstudioCarrera.entity";

import { CreatePersonaoDto } from "../persona/dto/createPersona.dto";
import { CreateInscriptionDto } from "./dto/createInscription.dto";

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(MatriculaEstudiante)
    private matriculaRepository: Repository<MatriculaEstudiante>,
    @InjectRepository(InstitucionEducativaEstudiante)
    private ieeRepository: Repository<InstitucionEducativaEstudiante>,
    @InjectRepository(InstitutoEstudianteInscripcion)
    private inscripcionRepository: Repository<InstitutoEstudianteInscripcion>,
    @InjectRepository(InstitucionEducativaSucursal)
    private ieSucursalRepository: Repository<InstitucionEducativaSucursal>,
    @InjectRepository(GestionTipo)
    private gestionTipoRepository: Repository<GestionTipo>,
    @InjectRepository(PeriodoTipo)
    private periodoTipoRepository: Repository<PeriodoTipo>,
    @InjectRepository(PlanEstudioCarrera)
    private planEstudioRepository: Repository<PlanEstudioCarrera>,
    private _serviceResp: RespuestaSigedService,
    private _servicePersona: PersonaService
  ) {}

  async createMatricula(dto: CreateInscriptionDto) {
    //1: existe la persona ?
    const persona = await this._servicePersona.findPersona(dto.personaId);
    //console.log('persona: ', persona);

    if (persona.length == 0) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "Persona No Encontrado !!",
        ""
      );
    }

    //2: existe la UE ?
    const institucionEducativaSucursal =
      await this.ieSucursalRepository.findOne({
        where: {
          id: dto.institucionEducativaSucursalId,
        },
      });
    //console.log("institucionEducativaSucursal: ", institucionEducativaSucursal);

    if (!institucionEducativaSucursal) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "institucionEducativaSucursal No Encontrado !!",
        ""
      );
    }

    const personaAux = persona[0];

    //3: ya existeun registro de esa persona en esa ue ?
    const existe = await this.ieeRepository.query(`
        select count(*) as existe from institucion_educativa_estudiante 
        where persona_id = ${dto.personaId}  and institucion_educativa_sucursal_id = ${dto.institucionEducativaSucursalId}`);

    /*if (parseInt(existe[0].existe) != 0) {
        console.log('existe: ', existe);
        return this._serviceResp.respuestaHttp404(
          "0",
          "registro ya existe !!",
          ""
        );
    }*/

    //4: esxiste gstionTipo ?
    const gestionTipo = await this.gestionTipoRepository.findOne({
      where: {
        id: dto.gestionTipoId,
      },
    });

    if (!gestionTipo) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "gestionTipo No Encontrado !!",
        ""
      );
    }

    //5: esxiste periodoTipo ?
    const periodoTipo = await this.periodoTipoRepository.findOne({
      where: {
        id: dto.periodoTipoId,
      },
    });

    if (!periodoTipo) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "periodoTipo No Encontrado !!",
        ""
      );
    }

    //6: esxiste planEstudioCarrera ?
    const planEstudioCarrera = await this.planEstudioRepository.findOne({
      where: {
        id: dto.planEstudioCarreraTipoId,
      },
    });

    if (!planEstudioCarrera) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "planEstudioCarrera No Encontrado !!",
        ""
      );
    }

    try {
      let ieeId = 0;
      if (parseInt(existe[0].existe) === 0) {
        //no existe, se inserta
        const res = await this.ieeRepository
          .createQueryBuilder()
          .insert()
          .into(InstitucionEducativaEstudiante)
          .values([
            {
              observacion: dto.observacion,
              persona: personaAux,
              institucionEducativaSucursal: institucionEducativaSucursal,
              codigoEstudiante: dto.codigoEstudiante,
              usuarioId: 0,
            },
          ])
          .returning("id")
          .execute();

        console.log("res:", res);
        let ieeId = res.identifiers[0].id;
      } else {
        //ya existe, necesitmos el id de institucion_educativa_estudiante

        const iee = await this.ieeRepository.query(`
            select id from institucion_educativa_estudiante 
            where persona_id = ${dto.personaId}  and institucion_educativa_sucursal_id = ${dto.institucionEducativaSucursalId}`);

        ieeId = iee[0].id;
      }

      const institucionEducativaEstudiante = await this.ieeRepository.findOne({
        where: {
          id: ieeId,
        },
      });

      //ya existe un registro para la gestion, periodo, ue, plan ?
      const existeMat = await this.matriculaRepository.query(`
        select count(*) as existe 
        from matricula_estudiante 
        where 
        institucion_educativa_estudiante_id = ${ieeId}  and 
        plan_estudio_carrera_id = ${dto.planEstudioCarreraTipoId} and 
        gestion_tipo_id = ${dto.gestionTipoId} and 
        periodo_tipo_id = ${dto.periodoTipoId}  
        `);

      /*if (parseInt(existe[0].existe) != 0) {
            console.log('existe: ', existe);
            return this._serviceResp.respuestaHttp404(
            "0",
            "registro ya existe !!",
            ""
            );
        }*/
      if (parseInt(existeMat[0].existe) == 0) {
        //insert en  matricula estudiante
        const resMat = await this.matriculaRepository
          .createQueryBuilder()
          .insert()
          .into(MatriculaEstudiante)
          .values([
            {
              docMatricula: dto.docMatricula,
              usuarioId: 0,
              gestionTipo: gestionTipo,
              periodoTipo: periodoTipo,
              planEstudioCarrera: planEstudioCarrera,
              institucionEducativaEstudiante: institucionEducativaEstudiante,
            },
          ])
          .returning("id")
          .execute();
      } else {
        return this._serviceResp.respuestaHttp201(
          ieeId,
          "Matricula ya Existe en la misma Gestion, Periodo y U.E !!",
          ""
        );
      }

      return this._serviceResp.respuestaHttp201(
        ieeId,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar inscripcion: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar Matricula: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async createInscription(dto: CreateInscriptionDto) {}
}
