import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
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
import { Aula } from "../../entidades/aula.entity";
import { EstadoMatriculaTipo } from "../../entidades/estadoMatriculaTipo.entity";
import { OfertaCurricular } from "../../entidades/ofertaCurricular.entity";
import { InstitutoPlanEstudioCarrera } from "../../entidades/institutoPlanEstudioCarrera.entity";

import { CreatePersonaoDto } from "../persona/dto/createPersona.dto";
import { CreateInscriptionDto } from "./dto/createInscription.dto";
import { CreateMatriculaDto } from "./dto/createMatricula.dto";
import { UsersService } from "../../../users/users.service";
import { CreateInscriptionNuevoDto } from "./dto/createInscriptionNuevo.dto";
import { OperativoCarreraAutorizadaService } from "../operativo_carrera_autorizada/operativo_carrera_autorizada.service";

//para exportar a xls
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { writeFile } from "fs/promises";
import { TblAuxiliarSie } from "src/academico/entidades/tblAuxiliarSie";

@Injectable()
export class InscripcionService {
  constructor(
    
    @InjectRepository(TblAuxiliarSie, "siedb")
    private sieRepository: Repository<TblAuxiliarSie>,
    
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
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
    @InjectRepository(EstadoMatriculaTipo)
    private estadoMatriculaRepository: Repository<EstadoMatriculaTipo>,
    @InjectRepository(OfertaCurricular)
    private ofertaCurricularRepository: Repository<OfertaCurricular>,
    @InjectRepository(InstitutoPlanEstudioCarrera)
    private ipecRepository: Repository<InstitutoPlanEstudioCarrera>,
    private _serviceResp: RespuestaSigedService,
    private _servicePersona: PersonaService,
    private readonly usersService: UsersService,
    private readonly opeCarreraService: OperativoCarreraAutorizadaService
  ) { }

  async createMatricula(dto: CreateMatriculaDto) {
    const persona = await this._servicePersona.findPersona(dto.personaId);
    if (persona.length == 0) {
      //no existe la,persona
      return this._serviceResp.respuestaHttp404(
        dto.personaId,
        "Persona No Encontrado !!",
        ""
      );
    }
    const personaAux = persona[0];

    const institucionEducativaSucursal =
      await this.ieSucursalRepository.findOne({
        where: {
          id: dto.institucionEducativaSucursalId,
        },
      });
    if (!institucionEducativaSucursal) {
      return this._serviceResp.respuestaHttp404(
        dto.institucionEducativaSucursalId,
        "institucionEducativaSucursalId No Encontrado !!",
        ""
      );
    }

    const gestionTipo = await this.gestionTipoRepository.findOne({
      where: {
        id: dto.gestionTipoId,
      },
    });
    if (!gestionTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.gestionTipoId,
        "gestionTipoId No Encontrado !!",
        ""
      );
    }

    const periodoTipo = await this.periodoTipoRepository.findOne({
      where: {
        id: dto.periodoTipoId,
      },
    });
    if (!periodoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.periodoTipoId,
        "periodoTipo No Encontrado !!",
        ""
      );
    }

    const institutoPlanEstudioCarrera = await this.ipecRepository.findOne({
      where: {
        id: dto.institutoPlanEstudioCarreraId,
      },
    });
    if (!institutoPlanEstudioCarrera) {
      return this._serviceResp.respuestaHttp404(
        dto.institutoPlanEstudioCarreraId,
        "institutoPlanEstudioCarreraId No Encontrado !!",
        ""
      );
    }

    try {
      const existe = await this.inscripcionRepository.query(`
        select count(*) as existe 
        from 
        institucion_educativa_estudiante
        where
          institucion_educativa_sucursal_id = ${dto.institucionEducativaSucursalId} and 
          persona_id = ${dto.personaId}
      
        `);


      if (parseInt(existe[0].existe) == 0) {
        //si no existe, es nuevo nuevo, se crean ambos
        console.log("insertar institucionEducativaEstudiante");
        let institucionEducativaEstudiante = this.ieeRepository.create({
          observacion: dto.observacion,
          persona: personaAux,
          institucionEducativaSucursal: institucionEducativaSucursal,
          codigoEstudiante: dto.codigoEstudiante,
          usuarioId: 0,
        });
        await this.ieeRepository.save(institucionEducativaEstudiante);

        console.log(
          "insertado institucionEducativaEstudiante: ",
          institucionEducativaEstudiante
        );

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
              institutoPlanEstudioCarrera: institutoPlanEstudioCarrera,
              institucionEducativaEstudiante: institucionEducativaEstudiante,
            },
          ])
          .returning("id")
          .execute();

        //console.log("newusuario", newusuario);
        return this._serviceResp.respuestaHttp201(
          resMat,
          "Registro MAT + USER Creado !!",
          ""
        );
      } else {
        // existe un registro de ese estudiante en esa institucion, se verifica si ya existe matricula

        const iee = await this.inscripcionRepository.query(`
          select id
          from 
          institucion_educativa_estudiante
          where
            institucion_educativa_sucursal_id = ${dto.institucionEducativaSucursalId} and 
            persona_id = ${dto.personaId}
        
          `);



        //buscamos si existe la matricula
        const existeMat = await this.inscripcionRepository.query(`
          select count(*) as existe 
          from 
          matricula_estudiante
          where
            instituto_plan_estudio_carrera_id = ${dto.institutoPlanEstudioCarreraId} and 
            institucion_educativa_estudiante_id = ${iee[0].id} and
            gestion_tipo_id = ${dto.gestionTipoId} and
            periodo_tipo_id = ${dto.periodoTipoId}
        
          `);

        const institucionEducativaEstudiante = await this.ieeRepository.findOne({
          where: {
            id: iee[0].id
          }
        }
        );

        console.log('iee[0].id: ', iee[0].id);
        console.log('institucionEducativaEstudiante: ', institucionEducativaEstudiante);
        //return;

        if (parseInt(existeMat[0].existe) == 0) {
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
                institutoPlanEstudioCarrera: institutoPlanEstudioCarrera,
                institucionEducativaEstudiante:
                  institucionEducativaEstudiante,
              },
            ])
            .returning("id")
            .execute();

          //console.log("newusuario", newusuario);
          return this._serviceResp.respuestaHttp201(
            resMat,
            "Registro MAT + USER Creado !!",
            ""
          );
        } else {
          // la matricula ya exuste, no se hace nada

          return this._serviceResp.respuestaHttp400(
            0,
            "MATRICULA YA EXISTE EN ESTA GESTION Y PERIODO !!",
            ""
          );
        }
      }
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

  async createInscription(dto: CreateInscriptionDto) {
    //1: existe matricula ?
    const matriculaEstudiante = await this.matriculaRepository.findOne({
      where: {
        id: dto.matriculaEstudianteId,
      },
    });
    if (!matriculaEstudiante) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "Matricula No Encontrado !!",
        ""
      );
    }

    //2: existe aula ?
    const aula = await this.aulaRepository.findOne({
      where: {
        id: dto.aulaId,
      },
    });
    if (!aula) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "aula No Encontrado !!",
        ""
      );
    }

    //3: existe estado matricula ?
    const estadoMatriculaTipo = await this.estadoMatriculaRepository.findOne({
      where: {
        id: dto.estadoMatriculaTipoId,
      },
    });
    if (!estadoMatriculaTipo) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "estadoMatriculaTipo No Encontrado !!",
        ""
      );
    }

    //4: existe estado matricula Inicio?
    const estadoMatriculaTipoInicio =
      await this.estadoMatriculaRepository.findOne({
        where: {
          id: dto.estadoMatriculaInicioTipoId,
        },
      });
    if (!estadoMatriculaTipoInicio) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "estadoMatriculaTipoInicio No Encontrado !!",
        ""
      );
    }

    //5: existe oferta curricular?
    const ofertaCurricular = await this.ofertaCurricularRepository.findOne({
      where: {
        id: dto.ofertaCurricularId,
      },
    });
    if (!ofertaCurricular) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "ofertaCurricular No Encontrado !!",
        ""
      );
    }

    //6: ya existe el mismo registro ?
    const existe = await this.inscripcionRepository.query(`
        select count(*) as existe 
        from instituto_estudiante_inscripcion 
        where 
        matricula_estudiante_id = ${dto.matriculaEstudianteId}  and 
        aula_id = ${dto.aulaId} and 
        estadomatricula_tipo_id = ${dto.estadoMatriculaTipoId} and 
        estadomatricula_inicio_tipo_id = ${dto.estadoMatriculaInicioTipoId} and 
        oferta_curricular_id = ${dto.ofertaCurricularId}  
        `);

    if (parseInt(existe[0].existe) != 0) {
      return this._serviceResp.respuestaHttp404(
        "0",
        "registro de inscripcion ya existe !!",
        ""
      );
    }

    //insert en instituto_estudiante_inscripcion

    try {
      const res = await this.inscripcionRepository
        .createQueryBuilder()
        .insert()
        .into(InstitutoEstudianteInscripcion)
        .values([
          {
            observacion: dto.observacion,
            usuarioId: 0,
            estadoMatriculaInicioTipoId: dto.estadoMatriculaInicioTipoId,
            aula: aula,
            ofertaCurricular: ofertaCurricular,
            estadoMatriculaTipo: estadoMatriculaTipo,
            matriculaEstudiante: matriculaEstudiante,
          },
        ])
        .returning("id")
        .execute();

      console.log("res:", res);
      let inscripcionId = res.identifiers[0].id;

      return this._serviceResp.respuestaHttp201(
        inscripcionId,
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

  async createInscriptionNuevo(dtos: CreateInscriptionNuevoDto[]) {
    //valida los parametros
    for (let index = 0; index < dtos.length; index++) {
      let dto = dtos[index];

      console.log("index: ", index);
      console.log(dto);

      //1: existe matricula ?
      const matriculaEstudiante = await this.matriculaRepository.findOne({
        where: {
          id: dto.matriculaEstudianteId,
        },
      });
      if (!matriculaEstudiante) {
        return this._serviceResp.respuestaHttp404(
          "0",
          "Matricula No Encontrado !!",
          ""
        );
      }

      //2: existe aula ?
      const aula = await this.aulaRepository.findOne({
        where: {
          id: dto.aulaId,
        },
      });
      if (!aula) {
        return this._serviceResp.respuestaHttp404(
          dto.aulaId,
          "aulaId No Encontrado !!",
          ""
        );
      }

      //: existe oferta curricular?
      const ofertaCurricular = await this.ofertaCurricularRepository.findOne({
        where: {
          id: dto.ofertaCurricularId,
        },
      });
      if (!ofertaCurricular) {
        return this._serviceResp.respuestaHttp404(
          dto.ofertaCurricularId,
          "ofertaCurricular No Encontrado !!",
          ""
        );
      }
    }

    //existe todo, se inserta uno a uno
    let insertados = [];
    try {
      for (let index = 0; index < dtos.length; index++) {
        let dto = dtos[index];

        const existe = await this.inscripcionRepository.query(`
        select count(*) as existe 
        from instituto_estudiante_inscripcion 
        where 
        matricula_estudiante_id = ${dto.matriculaEstudianteId}  and 
        aula_id = ${dto.aulaId} and 
        estadomatricula_tipo_id = 1 and 
        estadomatricula_inicio_tipo_id = 0 and 
        oferta_curricular_id = ${dto.ofertaCurricularId}  
        `);

        // inserta solo si es que NO existe
        if (parseInt(existe[0].existe) == 0) {
          const aula = await this.aulaRepository.findOne({
            where: {
              id: dto.aulaId,
            },
          });

          const ofertaCurricular =
            await this.ofertaCurricularRepository.findOne({
              where: {
                id: dto.ofertaCurricularId,
              },
            });

          const matriculaEstudiante = await this.matriculaRepository.findOne({
            where: {
              id: dto.matriculaEstudianteId,
            },
          });

          const estadoMatriculaTipo =
            await this.estadoMatriculaRepository.findOne({
              where: {
                id: 1,
              },
            });

          const res = await this.inscripcionRepository
            .createQueryBuilder()
            .insert()
            .into(InstitutoEstudianteInscripcion)
            .values([
              {
                observacion: "Inscrito Nuevo - Gestion 2023",
                usuarioId: 0,
                estadoMatriculaInicioTipoId: 0,
                aula: aula,
                ofertaCurricular: ofertaCurricular,
                estadoMatriculaTipo: estadoMatriculaTipo,
                matriculaEstudiante: matriculaEstudiante,
              },
            ])
            .returning("id")
            .execute();

          console.log("res:", res);
          let inscripcionId = res.identifiers[0].id;
          insertados.push(inscripcionId);
        }
      }
      // ha insertado todos los que no existian
      return this._serviceResp.respuestaHttp201(
        insertados,
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

  async createInscriptionTransitabilidad(dtos: CreateInscriptionNuevoDto[]) {
    //valida los parametros
    for (let index = 0; index < dtos.length; index++) {
      let dto = dtos[index];

      console.log("index: ", index);
      console.log(dto);

      //1: existe matricula ?
      const matriculaEstudiante = await this.matriculaRepository.findOne({
        where: {
          id: dto.matriculaEstudianteId,
        },
      });
      if (!matriculaEstudiante) {
        return this._serviceResp.respuestaHttp404(
          "0",
          "Matricula No Encontrado !!",
          ""
        );
      }

      //2: existe aula ?
      const aula = await this.aulaRepository.findOne({
        where: {
          id: dto.aulaId,
        },
      });
      if (!aula) {
        return this._serviceResp.respuestaHttp404(
          dto.aulaId,
          "aulaId No Encontrado !!",
          ""
        );
      }

      //: existe oferta curricular?
      const ofertaCurricular = await this.ofertaCurricularRepository.findOne({
        where: {
          id: dto.ofertaCurricularId,
        },
      });
      if (!ofertaCurricular) {
        return this._serviceResp.respuestaHttp404(
          dto.ofertaCurricularId,
          "ofertaCurricular No Encontrado !!",
          ""
        );
      }
    }

    //existe todo, se inserta uno a uno
    let insertados = [];
    try {
      for (let index = 0; index < dtos.length; index++) {
        let dto = dtos[index];

        const existe = await this.inscripcionRepository.query(`
        select count(*) as existe 
        from instituto_estudiante_inscripcion 
        where 
        matricula_estudiante_id = ${dto.matriculaEstudianteId}  and 
        aula_id = ${dto.aulaId} and 
        estadomatricula_tipo_id = 1 and 
        estadomatricula_inicio_tipo_id = 0 and 
        oferta_curricular_id = ${dto.ofertaCurricularId}  
        `);

        // inserta solo si es que NO existe
        if (parseInt(existe[0].existe) == 0) {
          const aula = await this.aulaRepository.findOne({
            where: {
              id: dto.aulaId,
            },
          });

          const ofertaCurricular =
            await this.ofertaCurricularRepository.findOne({
              where: {
                id: dto.ofertaCurricularId,
              },
            });

          const matriculaEstudiante = await this.matriculaRepository.findOne({
            where: {
              id: dto.matriculaEstudianteId,
            },
          });

          const estadoMatriculaTipo =
            await this.estadoMatriculaRepository.findOne({
              where: {
                id: 1,
              },
            });

          const res = await this.inscripcionRepository
            .createQueryBuilder()
            .insert()
            .into(InstitutoEstudianteInscripcion)
            .values([
              {
                observacion: "Inscrito Nuevo por transitabilidad BTH",
                usuarioId: 0,
                estadoMatriculaInicioTipoId: 90, //TRANSITABILIDAD BTH
                aula: aula,
                ofertaCurricular: ofertaCurricular,
                estadoMatriculaTipo: estadoMatriculaTipo,
                matriculaEstudiante: matriculaEstudiante,
              },
            ])
            .returning("id")
            .execute();

          console.log("res:", res);
          let inscripcionId = res.identifiers[0].id;
          insertados.push(inscripcionId);
        }
      }
      // ha insertado todos los que no existian
      return this._serviceResp.respuestaHttp201(
        insertados,
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

  async getAllMatriculadosByGestionOLD(
    gestionId: number,
    periodoId: number,
    carreraAutorizadaId: number,
    ieId: number
  ) {
    //TODO: aumentar ueId

    const result = await this.inscripcionRepository.query(`
   
      SELECT
        carrera_autorizada.id AS carrera_autorizada_id, 
        carrera_tipo.id AS carrera_tipo_id, 
        carrera_tipo.carrera, 
        instituto_plan_estudio_carrera.id AS instituto_plan_estudio_carrera_id, 
        matricula_estudiante.id AS matricula_estudiante_id, 
        matricula_estudiante.gestion_tipo_id, 
        matricula_estudiante.periodo_tipo_id, 
        matricula_estudiante.doc_matricula, 
        persona.id AS persona_id, 
        persona.carnet_identidad, 
        persona.complemento, 
        persona.paterno, 
        persona.materno, 
        persona.nombre, 
        institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
        institucion_educativa.id as institucion_educativa_id, 
        institucion_educativa.institucion_educativa,
        (select count(matricula_estudiante_id) from instituto_estudiante_inscripcion where matricula_estudiante_id =  matricula_estudiante.id) as inscrito_en_la_gestion 
      FROM
        carrera_autorizada
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          carrera_autorizada."id" = instituto_plan_estudio_carrera.carrera_autorizada_id
        INNER JOIN
        matricula_estudiante
        ON 
          instituto_plan_estudio_carrera.id = matricula_estudiante.instituto_plan_estudio_carrera_id
        INNER JOIN
        carrera_tipo
        ON 
          carrera_autorizada.carrera_tipo_id = carrera_tipo.id
        INNER JOIN
        institucion_educativa_estudiante
        ON 
          matricula_estudiante.institucion_educativa_estudiante_id = institucion_educativa_estudiante.id
        INNER JOIN
        persona
        ON 
          institucion_educativa_estudiante.persona_id = persona.id
        INNER JOIN
        institucion_educativa_sucursal
        ON 
          carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id AND
          institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
        INNER JOIN
        institucion_educativa
        ON 
          institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
      WHERE
        carrera_autorizada.id = ${carreraAutorizadaId} and 
        institucion_educativa.id =  ${ieId}  and 
        matricula_estudiante.periodo_tipo_id = ${periodoId} and 
        matricula_estudiante.gestion_tipo_id = ${gestionId}
        order by paterno, materno, nombre
    `);

    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllMatriculadosByGestion(
    gestionId: number,
    periodoId: number,
    carreraAutorizadaId: number,
    ieId: number,
    ipecId: number
  ) {
    //TODO: aumentar ueId

    const result = await this.inscripcionRepository.query(`
   
      SELECT
        carrera_autorizada.id AS carrera_autorizada_id, 
        carrera_tipo.id AS carrera_tipo_id, 
        carrera_tipo.carrera, 
        instituto_plan_estudio_carrera.id AS instituto_plan_estudio_carrera_id, 
        matricula_estudiante.id AS matricula_estudiante_id, 
        matricula_estudiante.gestion_tipo_id, 
        matricula_estudiante.periodo_tipo_id, 
        matricula_estudiante.doc_matricula, 
        persona.id AS persona_id, 
        persona.carnet_identidad, 
        persona.complemento, 
        persona.paterno, 
        persona.materno, 
        persona.nombre, 
        institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
        institucion_educativa.id as institucion_educativa_id, 
        institucion_educativa.institucion_educativa,
        (select count(matricula_estudiante_id) from instituto_estudiante_inscripcion where matricula_estudiante_id =  matricula_estudiante.id) as inscrito_en_la_gestion 
      FROM
        carrera_autorizada
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          carrera_autorizada."id" = instituto_plan_estudio_carrera.carrera_autorizada_id
        INNER JOIN
        matricula_estudiante
        ON 
          instituto_plan_estudio_carrera.id = matricula_estudiante.instituto_plan_estudio_carrera_id
        INNER JOIN
        carrera_tipo
        ON 
          carrera_autorizada.carrera_tipo_id = carrera_tipo.id
        INNER JOIN
        institucion_educativa_estudiante
        ON 
          matricula_estudiante.institucion_educativa_estudiante_id = institucion_educativa_estudiante.id
        INNER JOIN
        persona
        ON 
          institucion_educativa_estudiante.persona_id = persona.id
        INNER JOIN
        institucion_educativa_sucursal
        ON 
          carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id AND
          institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
        INNER JOIN
        institucion_educativa
        ON 
          institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
      WHERE
        carrera_autorizada.id = ${carreraAutorizadaId} and 
        institucion_educativa.id =  ${ieId}  and 
        matricula_estudiante.periodo_tipo_id = ${periodoId} and 
        matricula_estudiante.gestion_tipo_id = ${gestionId} and
        matricula_estudiante.instituto_plan_estudio_carrera_id = ${ipecId}
        order by paterno, materno, nombre
    `);

    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllInscritosByAulaId(id: number) {
    const result = await this.inscripcionRepository
      .createQueryBuilder("i")
      .innerJoinAndSelect("i.aula", "a")
      .innerJoinAndSelect("a.aulasDocentes", "d")
      .innerJoinAndSelect("i.matriculaEstudiante", "me")
      .innerJoinAndSelect("me.institucionEducativaEstudiante", "ie")
      .innerJoinAndSelect("ie.persona", "p")
      .select([
        "i.id as instituto_estudiante_inscripcion_id",
        "a.id as aula_id",
        "p.paterno as paterno",
        "p.materno as materno",
        "p.nombre as nombre",
        "p.carnetIdentidad as carnet_identidad",
        "d.id as aula_docente_id",
      ])
      .where("i.aulaId = :id", { id })
      .andWhere("d.bajaTipoId = 0")
      .getRawMany();
    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }
  async getAllReprobadosByAulaId(id: number) {
    const result = await this.inscripcionRepository
      .createQueryBuilder("i")
      .innerJoinAndSelect("i.aula", "a")
      .innerJoinAndSelect("a.aulasDocentes", "d")
      .innerJoinAndSelect("i.matriculaEstudiante", "me")
      .innerJoinAndSelect("me.institutoEstudianteInscripcions", "iei")
      .innerJoinAndSelect("me.institucionEducativaEstudiante", "ie")
      .innerJoinAndSelect("ie.persona", "p")
      .select([
        "i.id as instituto_estudiante_inscripcion_id",
        "a.id as aula_id",
        "p.paterno as paterno",
        "p.materno as materno",
        "p.nombre as nombre",
        "p.carnetIdentidad as carnet_identidad",
        "d.id as aula_docente_id",
      ])
      .where("i.aulaId = :id", { id })
      .andWhere("iei.estadoMatriculaTipoId = 43 ")
      .andWhere("d.bajaTipoId = 0")
      .getRawMany();
    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllReprobadosRecuperatorioByAulaId2(id: number) {
  

  const result = await this.inscripcionRepository
    .createQueryBuilder("i")
    .innerJoinAndSelect("i.aula", "a")
    .innerJoinAndSelect("a.aulasDocentes", "d")
    .innerJoinAndSelect("i.matriculaEstudiante", "me")
  //  .innerJoinAndSelect("me.institutoEstudianteInscripcions", "iei")
    .innerJoinAndSelect("i.inscripcionesDocentesCalificaciones", "ca")
    .innerJoinAndSelect("me.institucionEducativaEstudiante", "ie")
    .innerJoinAndSelect("ie.persona", "p")
    .select([
      "i.id as instituto_estudiante_inscripcion_id",
      "a.id as aula_id",
      "me.id as matricula_id",
      "p.paterno as paterno",
      "p.materno as materno",
      "p.nombre as nombre",
      "p.carnetIdentidad as carnet_identidad",
      "d.id as aula_docente_id",
      "ca.cuantitativa"
    ])
    .where("i.aulaId = :id", { id })
    .andWhere("i.estadoMatriculaTipoId = 43 ")
    .andWhere("d.bajaTipoId = 0")
    .andWhere("ca.notaTipoId = 7")
    .andWhere("ca.modalidadEvaluacionTipoId = 7")
    .andWhere("ca.cuantitativa >= 40")
    .andWhere((qb) =>
    qb
      .select('count(iei.matriculaEstudianteId)')
      .from(InstitucionEducativaEstudiante, 'iei')
      .where('iei.matriculaEstudianteId = i.matriculaEstudianteId')
      .andWhere('iei.estadoMatriculaTipoId = 43')
      .getQuery())
    .getRawMany();
  console.log("result: ", result);

  return this._serviceResp.respuestaHttp200(
    result,
    "Registro Encontrado !!",
    ""
  );
}

  async getAllReprobadosRecuperatorioByAulaId(id: number, regimen: number) {

    let maximo = 2;
    if(regimen==55) //anual
      maximo = 3; //maximo 3 asignaturas
      const result = await  this.inscripcionRepository.query(`
      SELECT cal.cuantitativa  as total, i.id as instituto_estudiante_inscripcion_id,a.id as aula_id, 
      i.matricula_estudiante_id  as matricula_id,
      p.paterno, p.paterno, p.nombre, p.carnet_identidad, d.id as aula_docente_id,
      (select count(iei.matricula_estudiante_id) from instituto_estudiante_inscripcion iei 
      WHERE iei.matricula_estudiante_id = i.matricula_estudiante_id and  iei.estadomatricula_tipo_id  = 43       
      HAVING COUNT(iei.matricula_estudiante_id)<=${maximo}
      ) as total_materias_reprobadas
      
      from instituto_estudiante_inscripcion i , aula a, aula_docente d, matricula_estudiante m ,
      instituto_estudiante_inscripcion_docente_calificacion cal,institucion_educativa_estudiante iee, persona p
      where 
      i.aula_id = ${id}
      and i.aula_id = a.id and d.aula_id=a.id 
      and d.baja_tipo_id = 0
      and i.matricula_estudiante_id =m.id
      and cal.instituto_estudiante_inscripcion_id =i.id
      and iee.id =m.institucion_educativa_estudiante_id
      and iee.persona_id = p.id 
      and cal.nota_tipo_id = 7
      and cal.modalidad_evaluacion_tipo_id  = 7
      and cal.cuantitativa >=40
      and i.estadomatricula_tipo_id  = 43

      `);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }
  async getAllInscritosCalificacionByAulaId(id: number) {
    console.log("calificaciones", id);
    const result = await this.inscripcionRepository
      .createQueryBuilder("i")
      .innerJoinAndSelect("i.aula", "a")
      .innerJoinAndSelect("i.estadoMatriculaTipo", "emt")
      .innerJoinAndSelect("a.aulasDocentes", "d")
      .innerJoinAndSelect("i.matriculaEstudiante", "me")
      .innerJoinAndSelect("me.institucionEducativaEstudiante", "ie")
      .innerJoinAndSelect("ie.persona", "p")
      .leftJoinAndSelect("i.inscripcionesDocentesCalificaciones", "dc")
      .leftJoinAndSelect("dc.notaTipo", "n")
      .leftJoinAndSelect("dc.modalidadEvaluacionTipo", "m")
      .select([
        "i.id",
        "emt.estadoMatricula",
        "d.id",
        "me.id",
        "ie.id",
        "p.id",
        "p.paterno",
        "p.materno",
        "p.nombre",
        "p.carnetIdentidad",
        "dc.id",
        "dc.cuantitativa",
        "n.id",
        "n.nota",
        "m.id",
        "m.modalidadEvaluacion"
      ])
      .where("i.aulaId = :id", { id })
      .orderBy("p.paterno")
      .getMany();
    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllInscritosByGestion(
    gestionId: number,
    periodoId: number,
    carreraId: number,
    ieId: number
  ) {
    //TODO: aumentar ueId

    const result = await this.inscripcionRepository.query(`
    
        select distinct id, institucion_educativa, ie_sucursal_id,persona_id,carnet_identidad, complemento, alumno, doc_matricula,
        carrera_id, carrera, gestion_tipo_id, periodo_tipo_id
        from
        (
        SELECT
                institucion_educativa.ID,
                institucion_educativa.institucion_educativa,
                institucion_educativa_sucursal.ID AS ie_sucursal_id,
                institucion_educativa_sucursal.sucursal_codigo,
                institucion_educativa_sucursal.sucursal_nombre,
                institucion_educativa_estudiante.persona_id,
                persona.carnet_identidad,
                persona.complemento,
                concat ( persona.paterno, ' ', persona.materno, ' ', persona.nombre ) AS alumno,
                matricula_estudiante.gestion_tipo_id,
                matricula_estudiante.periodo_tipo_id,
                matricula_estudiante.doc_matricula,
                carrera_tipo.id AS carrera_id,
                carrera_tipo.carrera
                        
            FROM
                institucion_educativa_estudiante
                INNER JOIN matricula_estudiante ON institucion_educativa_estudiante.id = matricula_estudiante.institucion_educativa_estudiante_id
                        INNER JOIN instituto_estudiante_inscripcion on  instituto_estudiante_inscripcion.matricula_estudiante_id = matricula_estudiante.id
                INNER JOIN plan_estudio_carrera ON matricula_estudiante.plan_estudio_carrera_id = plan_estudio_carrera.id
                INNER JOIN carrera_tipo ON plan_estudio_carrera.carrera_tipo_id = carrera_tipo.id
                INNER JOIN institucion_educativa_sucursal ON institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
                INNER JOIN institucion_educativa ON institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
                INNER JOIN persona ON institucion_educativa_estudiante.persona_id = persona.id
            WHERE 
                institucion_educativa.id = ${ieId} and
                matricula_estudiante.gestion_tipo_id = ${gestionId} and 
                periodo_tipo_id = ${periodoId} and 
                carrera_tipo.id = ${carreraId}
            order by persona.paterno, persona.materno, persona.nombre
            ) as data
    `);

    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllDetalleInscripcionPersona(
    personaId: number,
    gestionId: number,
    periodoId: number,
    carreraId: number,
    ieId: number
  ) {
    //TODO: aumentar ueId

    const result = await this.inscripcionRepository.query(`
    SELECT
        institucion_educativa.ID,
        institucion_educativa.institucion_educativa,
        institucion_educativa_sucursal.ID AS ie_sucursal_id,
        institucion_educativa_sucursal.sucursal_codigo,
        institucion_educativa_sucursal.sucursal_nombre,
        institucion_educativa_estudiante.persona_id,
        persona.carnet_identidad,
        persona.complemento,
        concat ( persona.paterno, ' ', persona.materno, ' ', persona.nombre ) AS alumno,
        matricula_estudiante.gestion_tipo_id,
        matricula_estudiante.periodo_tipo_id,
        matricula_estudiante.doc_matricula,
        carrera_tipo.id AS carrera_id,
        carrera_tipo.carrera,
				paralelo_tipo.paralelo,
				asignatura_tipo.asignatura,
				asignatura_tipo.abreviacion
    FROM
        institucion_educativa_estudiante
        INNER JOIN matricula_estudiante ON institucion_educativa_estudiante.id = matricula_estudiante.institucion_educativa_estudiante_id
				INNER JOIN instituto_estudiante_inscripcion on  instituto_estudiante_inscripcion.matricula_estudiante_id = matricula_estudiante.id
        INNER JOIN plan_estudio_carrera ON matricula_estudiante.plan_estudio_carrera_id = plan_estudio_carrera.id
        INNER JOIN carrera_tipo ON plan_estudio_carrera.carrera_tipo_id = carrera_tipo.id
        INNER JOIN institucion_educativa_sucursal ON institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
        INNER JOIN institucion_educativa ON institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
        INNER JOIN persona ON institucion_educativa_estudiante.persona_id = persona.id
        INNER JOIN aula  ON aula.id = instituto_estudiante_inscripcion.aula_id
        INNER JOIN paralelo_tipo on paralelo_tipo.id = aula.paralelo_tipo_id
        INNER JOIN oferta_curricular ON  oferta_curricular.id = instituto_estudiante_inscripcion.oferta_curricular_id
        INNER JOIN plan_estudio_asignatura ON plan_estudio_asignatura.id = oferta_curricular.plan_estudio_asignatura_id
        INNER JOIN asignatura_tipo on asignatura_tipo.id = plan_estudio_asignatura.asignatura_tipo_id
				
    WHERE 
        matricula_estudiante.gestion_tipo_id = ${gestionId} and 
        matricula_estudiante.periodo_tipo_id = ${periodoId} and 
        carrera_tipo.id = ${carreraId} and
		    institucion_educativa_estudiante.persona_id = ${personaId}
        
    order by persona.paterno, persona.materno, persona.nombre
    `);

    console.log("result: ", result);

    //result.gender =  'ddasda';

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllMateriasInscripcionNuevoOLD(carreraId: number) {
    const result = await this.inscripcionRepository.query(`
    SELECT
      plan_estudio_carrera.id as plan_estudio_carrera_id, 
      plan_estudio_carrera.carrera_tipo_id, 
      plan_estudio_carrera.nivel_academico_tipo_id, 
      plan_estudio_carrera.denominacion,
      regimen_grado_tipo.id as regimen_grado_tipo_id,  
      regimen_grado_tipo.regimen_grado, 
      regimen_grado_tipo.sigla, 
      asignatura_tipo.id as asignatura_tipo_id, 
      asignatura_tipo.asignatura, 
      asignatura_tipo.abreviacion, 
      carrera_tipo.carrera
    FROM
      plan_estudio_carrera
      INNER JOIN
      plan_estudio_asignatura
      ON 
        plan_estudio_carrera."id" = plan_estudio_asignatura.plan_estudio_carrera_id
      INNER JOIN
      asignatura_tipo
      ON 
        plan_estudio_asignatura.asignatura_tipo_id = asignatura_tipo.id
      INNER JOIN
      regimen_grado_tipo
      ON 
        plan_estudio_asignatura.regimen_grado_tipo_id = regimen_grado_tipo.id
      INNER JOIN
      carrera_tipo
      ON 
        plan_estudio_carrera.carrera_tipo_id = carrera_tipo.id
      where 
      plan_estudio_carrera.carrera_tipo_id = ${carreraId} and 
      regimen_grado_tipo.id = 1 and 
      plan_estudio_carrera.id = 11
    `);

    console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }
  async getDatoCarreraAutorizada(carreraAutorizadaId:number) {
    const intervaloGestion = await this.inscripcionRepository.query(`
      SELECT
        carrera_autorizada.id as carrera_autorizada_id, 
        carrera_autorizada_resolucion."id" as carrera_autorizada_resolucion_id, 
        carrera_autorizada_resolucion.descripcion, 
        carrera_autorizada_resolucion.numero_resolucion, 
        intervalo_gestion_tipo.id as intervalo_gestion_tipo_id, 
        intervalo_gestion_tipo.intervalo_gestion,
        carrera_tipo.carrera,
        carrera_tipo.especialidad_tecnico_humanistico_tipo_id
      FROM
        carrera_autorizada
        INNER JOIN
        carrera_autorizada_resolucion
        ON 
          carrera_autorizada.id = carrera_autorizada_resolucion.carrera_autorizada_id
        INNER JOIN
        intervalo_gestion_tipo
        ON 
          carrera_autorizada_resolucion.intervalo_gestion_tipo_id = intervalo_gestion_tipo.id
        INNER JOIN
        carrera_tipo
        ON 
          carrera_tipo.id =  carrera_autorizada.carrera_tipo_id
        where carrera_autorizada.id = ${carreraAutorizadaId}
    `);
  return intervaloGestion
  }

  async getListaParalelosRegimenGrado(carreraAutorizadaId:number, regimenGrado:number, matricula_estudiante:number) {

    const result = await this.inscripcionRepository.query(`
      SELECT
        institucion_educativa.id AS institucion_educativa_id, 
        institucion_educativa.institucion_educativa, 
        institucion_educativa_sucursal.id AS institucion_educativa_sucursal_id, 
        institucion_educativa_sucursal.sucursal_nombre, 
        carrera_autorizada.id AS carrera_autorizada_id, 
        carrera_autorizada.carrera_tipo_id, 
        carrera_tipo.carrera, 
        instituto_plan_estudio_carrera.id AS instituto_plan_estudio_carrera_id, 
        instituto_plan_estudio_carrera.carrera_autorizada_id AS instituto_plan_estudio_carrera_autorizada_id, 
        oferta_curricular.id AS oferta_curricular_id, 
        oferta_curricular.gestion_tipo_id, 
        oferta_curricular.periodo_tipo_id, 
        oferta_curricular.plan_estudio_asignatura_id AS oferta_curricular_plan_estudio_asignatura_id, 
        plan_estudio_asignatura.id AS plan_estudio_asignatura_id, 
        plan_estudio_asignatura.asignatura_tipo_id AS plan_estudio_asignatura_tipo_id, 
        asignatura_tipo.id AS asignatura_tipo_id, 
        asignatura_tipo.asignatura, 
        asignatura_tipo.abreviacion, 
        regimen_grado_tipo.id as regimen_grado_tipo_id, 
        regimen_grado_tipo.regimen_grado, 
        regimen_grado_tipo.sigla
      FROM
        institucion_educativa_sucursal
        INNER JOIN
        institucion_educativa
        ON 
          institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
        INNER JOIN
        carrera_autorizada
        ON 
          institucion_educativa_sucursal.id = carrera_autorizada.institucion_educativa_sucursal_id
        INNER JOIN
        carrera_tipo
        ON 
          carrera_autorizada.carrera_tipo_id = carrera_tipo.id
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          carrera_autorizada.id = instituto_plan_estudio_carrera.carrera_autorizada_id
        INNER JOIN
        oferta_curricular
        ON 
          instituto_plan_estudio_carrera."id" = oferta_curricular.instituto_plan_estudio_carrera_id
        INNER JOIN
        plan_estudio_asignatura
        ON 
          oferta_curricular.plan_estudio_asignatura_id = plan_estudio_asignatura.id
        INNER JOIN
        asignatura_tipo
        ON 
          plan_estudio_asignatura.asignatura_tipo_id = asignatura_tipo.id
        INNER JOIN
        regimen_grado_tipo
        ON 
          plan_estudio_asignatura.regimen_grado_tipo_id = regimen_grado_tipo.id AND
          plan_estudio_asignatura.regimen_grado_tipo_id = regimen_grado_tipo.id
      WHERE
        carrera_autorizada.id = ${carreraAutorizadaId} AND      
        regimen_grado_tipo.id = ${regimenGrado}

    `);
    for (let i = 0; i < result.length; i++) {
      console.log('i :', i);
      console.log('oferta_curricular.id', result[i].oferta_curricular_id);

      //concat((select substring(to_char(hora_inicio,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id), '-',(select substring(to_char(hora_fin,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id)) as horario,
      let res_paralelos = await this.inscripcionRepository.query(`
        SELECT
          case trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
          when '' then 'Sin Asignacion'
          else trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
          end
          as maestro,
          oferta_curricular.id as oferta_curricular_id, 
          aula.id as aula_id, 
          paralelo_tipo.id as paralelo_tipo_id, 
          paralelo_tipo.paralelo,           
          
          aula.activo,
          0 as inscrito
        FROM
          oferta_curricular
          INNER JOIN
          aula
          ON 
            oferta_curricular.id = aula.oferta_curricular_id
          INNER JOIN
          paralelo_tipo
          ON 
            aula.paralelo_tipo_id = paralelo_tipo.id
          left JOIN
          aula_docente
          ON 
            aula.id = aula_docente.aula_id
          left JOIN
          maestro_inscripcion
          ON 
            aula_docente.maestro_inscripcion_id = maestro_inscripcion.id
          left JOIN
          persona
          ON 
            maestro_inscripcion.persona_id = persona.id
          where 
          oferta_curricular.id = ${result[i].oferta_curricular_id}
          and maestro_inscripcion.vigente = TRUE
          and aula_docente.baja_tipo_id = 0
      `);

      
      for (let index = 0; index < res_paralelos.length; index++) {
        
        let horarios = await this.inscripcionRepository.query(`
          select 
            ( select dia from dia_tipo where id = dia_tipo_id) as dia,	
            ( select sigla from dia_tipo where id = dia_tipo_id) as sigla,	
            concat(substring(to_char(hora_inicio,'HH24:MI'),1,5), '-',(select substring(to_char(hora_fin,'HH24:MI'),1,5))) as horario
          from 
          aula_detalle where aula_id = ${res_paralelos[index]['aula_id']}
        `);

        res_paralelos[index]['horarios'] = horarios;
        
      }


      console.log('res_paralelos : ', res_paralelos);
      //console.log('horarios : ', horarios);

      //vemos los que ya esta inscrito

      for (let index = 0; index < res_paralelos.length; index++) {
        //por cada paralelo vemos si esta incrito

        const existe = await this.inscripcionRepository.query(`
        select count(*) as existe 
        from 
        instituto_estudiante_inscripcion
        where
          matricula_estudiante_id = ${matricula_estudiante} and
          aula_id = ${res_paralelos[index].aula_id} and 
          oferta_curricular_id = ${res_paralelos[index].oferta_curricular_id}      
        `);

        if (parseInt(existe[0].existe) != 0) {
          res_paralelos[index].inscrito = 1;
        }

      }

      let array_paralelos = res_paralelos;
      result[i].paralelos = array_paralelos;
    }
  return result
  }

  
  async getAllMateriasInscripcionNuevo(carreraAutorizadaId: number, matriculaEstudianteId: number) {
    // semestral ? anual ?
    const matricula_estudiante = matriculaEstudianteId; //62;

    const intervaloGestion = await this.getDatoCarreraAutorizada(carreraAutorizadaId);

    let regimen_grado_tipo_id = 0;
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 1) {
      // es semestral, el primer semestre es 1
      regimen_grado_tipo_id = 1;
    }
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 4) {
      // es anual, el primer año es 7
      regimen_grado_tipo_id = 7;
    }

    console.log('intervaloGestion : ', intervaloGestion);
    console.log('regimen_grado_tipo_id : ', regimen_grado_tipo_id);
    
    const result = await this.getListaParalelosRegimenGrado(carreraAutorizadaId, regimen_grado_tipo_id, matricula_estudiante);

    console.log('result : ', result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }


  async getAllMateriasInscripcionTransitabilidad(carreraAutorizadaId: number, matriculaEstudianteId: number) {
    // semestral ? anual ?
    const matricula_estudiante = matriculaEstudianteId; //62;

    const intervaloGestion = await this.getDatoCarreraAutorizada(carreraAutorizadaId);

    let regimen_grado_tipo_id = 0;
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 1) { //semestral
      // es semestral, al tercer semestre
      regimen_grado_tipo_id = 3;
    }
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 4) { //anual
      // es anual, al segundo año
      regimen_grado_tipo_id = 8;
    }

    let especialidad_bth_id = intervaloGestion[0].especialidad_tecnico_humanistico_tipo_id;

    console.log('intervaloGestion : ', intervaloGestion);
    console.log('regimen_grado_tipo_id : ', regimen_grado_tipo_id);
    console.log('especialidad : ', especialidad_bth_id);

      //validar que el estudiante corresponde a BTH de esa carrera
      const datoPersona = await this.matriculaRepository
      .createQueryBuilder("me")
      .innerJoin("me.institucionEducativaEstudiante", "iee")
      .innerJoin("iee.persona", "p")
      .select([
          "p.carnetIdentidad as carnet_identidad",
          "p.id as id",
      ])
      .where('me.id = :matriculaEstudianteId',{matriculaEstudianteId})
      .getRawOne();
      console.log("dato persona");
      console.log(datoPersona);

      //consulta SIGED
      //verificamos si el estudiante es BTH y la carrera corresponde
      const bth = await this.sieRepository.query(`
      SELECT
        bth_cut_ttm_estudiante.*
      FROM
        bth_cut_ttm_estudiante
        INNER JOIN estudiante_inscripcion_humnistico_tecnico eiht on bth_cut_ttm_estudiante.estudiante_inscripcion_id = eiht.estudiante_inscripcion_id
        INNER JOIN especialidad_tecnico_humanistico_tipo etht on etht.id = eiht.especialidad_tecnico_humanistico_tipo_id 
        INNER JOIN
        estudiante_inscripcion
        ON 
          estudiante_inscripcion.id = bth_cut_ttm_estudiante.estudiante_inscripcion_id  
        INNER JOIN
          estudiante
        ON 
        estudiante.id = estudiante_inscripcion.estudiante_id 
        WHERE estudiante.carnet_identidad = '${datoPersona.carnet_identidad}'
        AND etht.id = ${especialidad_bth_id}
    `);

    console.log("aqui el bth");
    console.log(bth);
    if(bth.length == 0){
      return this._serviceResp.respuestaHttp404(
        '',
        "El estudiante no corresponde a BTH de la ESPECIALIDAD/CARRERA seleccionada !!",
        ""
      );

    }

    const result = await this.getListaParalelosRegimenGrado(carreraAutorizadaId, regimen_grado_tipo_id, matricula_estudiante );

    console.log('result : ', result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  /**
   * esta version es SIN NOTAS, solo muestra las materias segun corresponda semestre o anual
   * @param carreraAutorizadaId 
   * @param matriculaEstudianteId 
   * @returns 
   */
  async getAllMateriasInscripcionAntiguoSINNOTAS(carreraAutorizadaId: number, matriculaEstudianteId: number) {

    //con carrera autorizada, obtenemos el pla_estudio_carrera_id, OJO SOLO  DEBERIA HABER UNO ?


    const planEstudioCarreraAux = await this.inscripcionRepository.query(`
        select plan_estudio_carrera_id from instituto_plan_estudio_carrera 
        where carrera_autorizada_id = ${carreraAutorizadaId}
    `);

    if (planEstudioCarreraAux.length == 0) {
      return this._serviceResp.respuestaHttp404(
        carreraAutorizadaId,
        "No existe plan de estudio para esta carrera !!",
        ""
      );
    }

    const plan_estudio_carrera_id = planEstudioCarreraAux[0]['plan_estudio_carrera_id'];
    console.log(plan_estudio_carrera_id);

    const result = await this.inscripcionRepository.query(`
      SELECT
        plan_estudio_asignatura.id, 
        plan_estudio_asignatura.plan_estudio_carrera_id, 
        plan_estudio_asignatura.regimen_grado_tipo_id, 
        plan_estudio_asignatura.asignatura_tipo_id, 
        plan_estudio_asignatura_regla.anterior_plan_estudio_asignatura_id, 
        plan_estudio_asignatura_regla.activo, 
        concat(asignatura_tipo.abreviacion, ' ', asignatura_tipo.asignatura) AS materia, 
        (select concat(abreviacion, ' ',asignatura) from asignatura_tipo where id in (select asignatura_tipo_id from plan_estudio_asignatura where id = anterior_plan_estudio_asignatura_id)) AS prerequisito, 
        instituto_plan_estudio_carrera.carrera_autorizada_id, 
        regimen_grado_tipo.intervalo_gestion_tipo_id, 
        regimen_grado_tipo.regimen_grado, 
        regimen_grado_tipo.sigla, 
        oferta_curricular.id as oferta_curricular_id, 
        oferta_curricular.gestion_tipo_id, 
        oferta_curricular.periodo_tipo_id
      FROM
        plan_estudio_asignatura
        LEFT JOIN
        plan_estudio_asignatura_regla
        ON 
          plan_estudio_asignatura.id = plan_estudio_asignatura_regla.plan_estudio_asignatura_id
        INNER JOIN
        asignatura_tipo
        ON 
          plan_estudio_asignatura.asignatura_tipo_id = asignatura_tipo.id
        INNER JOIN
        plan_estudio_carrera
        ON 
          plan_estudio_asignatura.plan_estudio_carrera_id = plan_estudio_carrera.id
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          plan_estudio_carrera.id = instituto_plan_estudio_carrera.plan_estudio_carrera_id
        INNER JOIN
        regimen_grado_tipo
        ON 
          plan_estudio_asignatura.regimen_grado_tipo_id = regimen_grado_tipo.id
        INNER JOIN
        oferta_curricular
        ON 
          plan_estudio_asignatura.id = oferta_curricular.plan_estudio_asignatura_id
      WHERE
        plan_estudio_asignatura.plan_estudio_carrera_id = ${plan_estudio_carrera_id}
      ORDER BY
        3 ASC, 
        7 ASC
    `);

    //un distinct de las etapas o grados 
    const etapas = result.map(item => item.regimen_grado)
      .filter((value, index, self) => self.indexOf(value) === index)

    console.log(etapas);

    let dataResult = [];

    for (let i = 0; i < etapas.length; i++) {


      let obj1 = { regimen_grado: etapas[i], asignaturas: [] };
      //filtramos todo lo que sea de la etapa

      let obj2 = result.filter(obj => {
        return obj.regimen_grado === etapas[i];
      });

      console.log('obj2 --> ', obj2);
      //return;

      for (let index = 0; index < obj2.length; index++) {

        let res_paralelos = await this.inscripcionRepository.query(`
            SELECT
              
              case trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
              when '' then 'Sin Asignacion'
              else trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
              end
              as maestro,
              oferta_curricular.id as oferta_curricular_id, 
              aula.id as aula_id, 
              paralelo_tipo.id as paralelo_tipo_id, 
              paralelo_tipo.paralelo, 
              concat((select substring(to_char(hora_inicio,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id), '-',(select substring(to_char(hora_fin,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id)) as horario,
              aula.activo,
              0 as inscrito
            FROM
              oferta_curricular
              INNER JOIN
              aula
              ON 
                oferta_curricular.id = aula.oferta_curricular_id
              INNER JOIN
              paralelo_tipo
              ON 
                aula.paralelo_tipo_id = paralelo_tipo.id
              left JOIN
              aula_docente
              ON 
                aula.id = aula_docente.aula_id
              left JOIN
              maestro_inscripcion
              ON 
                aula_docente.maestro_inscripcion_id = maestro_inscripcion.id
              left JOIN
              persona
              ON 
                maestro_inscripcion.persona_id = persona.id
              where 
              oferta_curricular.id = ${obj2[index].oferta_curricular_id}
          `);

        for (let j = 0; j < res_paralelos.length; j++) {
          //por cada paralelo vemos si esta incrito

          const existe = await this.inscripcionRepository.query(`
              select count(*) as existe 
                from 
                instituto_estudiante_inscripcion
                where
                  matricula_estudiante_id = ${matriculaEstudianteId} and
                  aula_id = ${res_paralelos[j].aula_id} and 
                  oferta_curricular_id = ${res_paralelos[j].oferta_curricular_id}      
                `);

          if (parseInt(existe[0].existe) != 0) {
            res_paralelos[j].inscrito = 1;
          }

        }

        obj2[index].paralelos = res_paralelos;

      }

      //obj1.asignaturas.push(obj2);
      obj1.asignaturas = obj2;
      dataResult.push(obj1);
    }
    //console.log('dataResult --> ', dataResult);



    return this._serviceResp.respuestaHttp200(
      dataResult,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllMateriasInscripcionAntiguo(carreraAutorizadaId: number, matriculaEstudianteId: number) {

    //con carrera autorizada, obtenemos el pla_estudio_carrera_id, OJO SOLO  DEBERIA HABER UNO ?

    //SE TOMA EN COSIDERACION LAS NOTAS DE APROBACION
    //REQUISITO QUE EN LA TABLA instituto_estudiante_inscripcion_docente_calificacion
    //DEBE HABER LA INSERCION DE UN REGISTRO CON EL ULTIMO ESTADO 7 NOTA FINAL SEMESTRAL, 8 NOTA FINAL ANUAL

    const planEstudioCarreraAux = await this.inscripcionRepository.query(`
        select plan_estudio_carrera_id from instituto_plan_estudio_carrera 
        where carrera_autorizada_id = ${carreraAutorizadaId}
    `);

    if (planEstudioCarreraAux.length == 0) {
      return this._serviceResp.respuestaHttp404(
        carreraAutorizadaId,
        "No existe plan de estudio para esta carrera !!",
        ""
      );
    }

    //OBTENEMOS LA PERSONA ID PARA VER SUS NOTAS
    const personaAux = await this.inscripcionRepository.query(`
    SELECT
      persona.id as persona_id, 
      persona.carnet_identidad, 
      matricula_estudiante.id as matricula_estudiante_id
    FROM
      matricula_estudiante
      INNER JOIN
      institucion_educativa_estudiante
      ON 
        matricula_estudiante.institucion_educativa_estudiante_id = institucion_educativa_estudiante.id
      INNER JOIN
      persona
      ON 
        institucion_educativa_estudiante.persona_id = persona.id
      where 
      matricula_estudiante.id = ${matriculaEstudianteId}
    `);
    const persona_id = personaAux[0]['persona_id'];

    // OJO: DEBE HABER SOLO UNO...el caso para 2 no esta definido.
    //si fuera semestral
    let estado_final = '7';
    const intervalo_carrera = await this.inscripcionRepository.query(`
      select intervalo_gestion_tipo_id from carrera_autorizada_resolucion where carrera_autorizada_id = ${carreraAutorizadaId}  order by id desc limit 1
    `);

    if (intervalo_carrera.length == 0) {

    } else {
      //vemos si es anual
      if (intervalo_carrera[0]['intervalo_gestion_tipo_id'] == 4) {
        //es anual
        let estado_final = '8';
      }
    }

    let sqlnotas = `
    select oferta_curricular_id as instituto_estudiante_inscripcion_id_no_aprobados from
    (
    select iei.oferta_curricular_id,
    (select count(id) from instituto_estudiante_inscripcion_docente_calificacion
    where  instituto_estudiante_inscripcion_id = iei.id and 
    modalidad_evaluacion_tipo_id = ${estado_final} and 
    nota_tipo_id = 1 and 
    cuantitativa >= 61) as aprobado
    
    FROM
    instituto_estudiante_inscripcion as iei
    where
    matricula_estudiante_id in  (
    select id from matricula_estudiante where 
    institucion_educativa_estudiante_id in (select id from institucion_educativa_estudiante where persona_id = ${persona_id} )
    )
    ) as data 
    where aprobado = 1
    `;


    const plan_estudio_carrera_id = planEstudioCarreraAux[0]['plan_estudio_carrera_id'];
    console.log(plan_estudio_carrera_id);

    const result = await this.inscripcionRepository.query(`
      SELECT
        plan_estudio_asignatura.id, 
        plan_estudio_asignatura.plan_estudio_carrera_id, 
        plan_estudio_asignatura.regimen_grado_tipo_id, 
        plan_estudio_asignatura.asignatura_tipo_id, 
        plan_estudio_asignatura_regla.anterior_plan_estudio_asignatura_id, 
        plan_estudio_asignatura_regla.activo, 
        concat(asignatura_tipo.abreviacion, ' ', asignatura_tipo.asignatura) AS materia, 
        (select concat(abreviacion, ' ',asignatura) from asignatura_tipo where id in (select asignatura_tipo_id from plan_estudio_asignatura where id = anterior_plan_estudio_asignatura_id)) AS prerequisito, 
        instituto_plan_estudio_carrera.carrera_autorizada_id, 
        regimen_grado_tipo.intervalo_gestion_tipo_id, 
        regimen_grado_tipo.regimen_grado, 
        regimen_grado_tipo.sigla, 
        oferta_curricular.id as oferta_curricular_id, 
        oferta_curricular.gestion_tipo_id, 
        oferta_curricular.periodo_tipo_id
      FROM
        plan_estudio_asignatura
        LEFT JOIN
        plan_estudio_asignatura_regla
        ON 
          plan_estudio_asignatura.id = plan_estudio_asignatura_regla.plan_estudio_asignatura_id
        INNER JOIN
        asignatura_tipo
        ON 
          plan_estudio_asignatura.asignatura_tipo_id = asignatura_tipo.id
        INNER JOIN
        plan_estudio_carrera
        ON 
          plan_estudio_asignatura.plan_estudio_carrera_id = plan_estudio_carrera.id
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          plan_estudio_carrera.id = instituto_plan_estudio_carrera.plan_estudio_carrera_id
        INNER JOIN
        regimen_grado_tipo
        ON 
          plan_estudio_asignatura.regimen_grado_tipo_id = regimen_grado_tipo.id
        INNER JOIN
        oferta_curricular
        ON 
          plan_estudio_asignatura.id = oferta_curricular.plan_estudio_asignatura_id
      WHERE
        plan_estudio_asignatura.plan_estudio_carrera_id = ${plan_estudio_carrera_id}
      ORDER BY
        3 ASC, 
        7 ASC
    `);

    //un distinct de las etapas o grados 
    const etapas = result.map(item => item.regimen_grado)
      .filter((value, index, self) => self.indexOf(value) === index)

    console.log(etapas);

    let dataResult = [];

    for (let i = 0; i < etapas.length; i++) {


      let obj1 = { regimen_grado: etapas[i], asignaturas: [] };
      //filtramos todo lo que sea de la etapa

      let obj2 = result.filter(obj => {
        return obj.regimen_grado === etapas[i];
      });

      console.log('obj2 --> ', obj2);
      //return;

      for (let index = 0; index < obj2.length; index++) {

        let res_paralelos = await this.inscripcionRepository.query(`
            SELECT
              
              case trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
              when '' then 'Sin Asignacion'
              else trim(concat(persona.paterno, ' ', persona.materno, ' ', persona.nombre))
              end
              as maestro,
              oferta_curricular.id as oferta_curricular_id, 
              aula.id as aula_id, 
              paralelo_tipo.id as paralelo_tipo_id, 
              paralelo_tipo.paralelo, 
              concat((select substring(to_char(hora_inicio,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id), '-',(select substring(to_char(hora_fin,'HH24:MI'),1,5) from aula_detalle where aula_id = aula.id)) as horario,
              aula.activo,
              0 as inscrito
            FROM
              oferta_curricular
              INNER JOIN
              aula
              ON 
                oferta_curricular.id = aula.oferta_curricular_id
              INNER JOIN
              paralelo_tipo
              ON 
                aula.paralelo_tipo_id = paralelo_tipo.id
              left JOIN
              aula_docente
              ON 
                aula.id = aula_docente.aula_id
              left JOIN
              maestro_inscripcion
              ON 
                aula_docente.maestro_inscripcion_id = maestro_inscripcion.id
              left JOIN
              persona
              ON 
                maestro_inscripcion.persona_id = persona.id
              where 
              oferta_curricular.id = ${obj2[index].oferta_curricular_id}
          `);

        for (let j = 0; j < res_paralelos.length; j++) {
          //por cada paralelo vemos si esta incrito

          const existe = await this.inscripcionRepository.query(`
              select count(*) as existe 
                from 
                instituto_estudiante_inscripcion
                where
                  matricula_estudiante_id = ${matriculaEstudianteId} and
                  aula_id = ${res_paralelos[j].aula_id} and 
                  oferta_curricular_id = ${res_paralelos[j].oferta_curricular_id}      
                `);

          if (parseInt(existe[0].existe) != 0) {
            res_paralelos[j].inscrito = 1;
          }

        }

        obj2[index].paralelos = res_paralelos;

      }

      //obj1.asignaturas.push(obj2);
      obj1.asignaturas = obj2;
      dataResult.push(obj1);
    }
    //console.log('dataResult --> ', dataResult);



    return this._serviceResp.respuestaHttp200(
      dataResult,
      "Registro Encontrado !!",
      ""
    );
  }

  //TODO: esto hay que repensar, debe ir por gestion ?
  // ESTO ES TEMPORAL
  async getPersonasSinMatricula(carreraAutorizadaId: number) {
    const personas = await this.inscripcionRepository.query(`
      SELECT
        id,carnet_identidad,complemento,concat(paterno, ' ', materno, ' ', nombre) as nombre
      FROM
        persona limit 20
    `);

    return this._serviceResp.respuestaHttp200(
      personas,
      "Registro Encontrado !!",
      ""
    );
  }

  //crea matricula de un array
  async createMatriculaLote(dtos: CreateMatriculaDto[]) {
    for (let index = 0; index < dtos.length; index++) {
      let dto = dtos[index];

      console.log("index: ", index);
      console.log(dto);
    }
  }

  async getCarrerasAutorizadas(ieSucursalId: number) {

    const result = await this.inscripcionRepository.query(`
    SELECT
      institucion_educativa_sucursal.id as institucion_educativa_sucursal_id, 
      institucion_educativa_sucursal.institucion_educativa_id, 
      carrera_autorizada.id as carrera_autorizada_id, 
      carrera_tipo.carrera, 
      carrera_autorizada_resolucion.descripcion as carrera_autorizada_resolucion_descripcion, 
      carrera_autorizada_resolucion.numero_resolucion as carrera_autorizada_resolucion_numero_resolucion, 
      carrera_autorizada_resolucion.fecha_resolucion as carrera_autorizada_resolucion_fecha_resolucion, 
      nivel_academico_tipo.nivel_academico, 
      nivel_academico_tipo.abreviacion, 
      intervalo_gestion_tipo.intervalo_gestion as regimen_estudio, 
      instituto_plan_estudio_carrera.id as instituto_plan_estudio_carrera_id, 
      instituto_plan_estudio_carrera.plan_estudio_carrera_id, 
      instituto_plan_estudio_carrera.carrera_autorizada_id as instituto_plan_estudio_carrera_carrera_autorizada_id, 
      plan_estudio_resolucion.id as plan_estudio_resolucion_id, 
      plan_estudio_resolucion.descripcion as plan_estudio_resolucion_descripcion, 
      plan_estudio_resolucion.numero_resolucion as plan_estudio_resolucion_numero_resolucion, 
      CAST(plan_estudio_resolucion.fecha_resolucion AS TEXT) as plan_estudio_resolucion_fecha_resolucion, 
      plan_estudio_resolucion.activo,
      plan_estudio_resolucion.descripcion
    FROM
      carrera_autorizada
      INNER JOIN
      institucion_educativa_sucursal
      ON 
        carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
      INNER JOIN
      carrera_tipo
      ON 
        carrera_autorizada.carrera_tipo_id = carrera_tipo.id
      INNER JOIN
      carrera_autorizada_resolucion
      ON 
        carrera_autorizada.id = carrera_autorizada_resolucion.carrera_autorizada_id
      INNER JOIN
      nivel_academico_tipo
      ON 
        carrera_autorizada_resolucion.nivel_academico_tipo_id = nivel_academico_tipo.id
      INNER JOIN
      intervalo_gestion_tipo
      ON 
        carrera_autorizada_resolucion.intervalo_gestion_tipo_id = intervalo_gestion_tipo.id
      INNER JOIN
      instituto_plan_estudio_carrera
      ON 
        carrera_autorizada.id = instituto_plan_estudio_carrera.carrera_autorizada_id
      INNER JOIN
      plan_estudio_carrera
      ON 
        carrera_tipo.id = plan_estudio_carrera.carrera_tipo_id AND
        instituto_plan_estudio_carrera.plan_estudio_carrera_id = plan_estudio_carrera.id AND
        intervalo_gestion_tipo.id = plan_estudio_carrera.intervalo_gestion_tipo_id AND
        nivel_academico_tipo.id = plan_estudio_carrera.nivel_academico_tipo_id AND
        plan_estudio_carrera.activo = true
      INNER JOIN
      plan_estudio_resolucion
      ON 
        plan_estudio_carrera.plan_estudio_resolucion_id = plan_estudio_resolucion.id and
        plan_estudio_resolucion.activo = true
    WHERE
      institucion_educativa_sucursal.id = ${ieSucursalId} 
    order by 4

  `);

    for (let index = 0; index < result.length; index++) {
      const operativo = await this.opeCarreraService.findOperativoActivoCarrera(result[index]['carrera_autorizada_id']);
      result[index]['operativo'] = operativo.data
    }


    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );

  }

  async getTotalEstudiantes(){
    const total = await this.ieeRepository
    .createQueryBuilder("iee")
    .innerJoin("iee.institucionEducativaSucursal", "s")
    .innerJoin("s.institucionEducativa", "i")
    .where('i.educacionTipoId in (7,8,9)')
    .getCount();
    
    return total 
  }
 
  async getTotalEstudiantesDependencia(){
    const lista = await this.ieeRepository
    .createQueryBuilder("iee")
    .innerJoin("iee.institucionEducativaSucursal", "s")
    .innerJoin("s.institucionEducativa", "a")
    .innerJoinAndSelect("a.jurisdiccionGeografica", "h")
    .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
    .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
    .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
    .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
    .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
    .innerJoin("a.acreditados", "e")
    .innerJoin("e.dependenciaTipo", "g")
    .select([
        "up4.lugar as departamento",
        "up4.id as departamento_id",
        "g.dependencia as dependencia",
        "g.id as dependencia_id",
        "COUNT(e.dependenciaTipoId) as total",  
        "COUNT(iee.id) as total_estudiantes",  
    ])
    .where('a.educacionTipoId in (7,8,9)')
    .groupBy('up4.id')
    .addGroupBy('g.dependencia')
    .addGroupBy('g.id')
    .getRawMany();
    
    return lista;
}

  //xls de matriculados
  async getXlsAllMatriculadosByGestion(
    gestionId: number,
    periodoId: number,
    carreraAutorizadaId: number,
    ieId: number,
    ipecId: number
  ) {
    //TODO: aumentar ueId

    const carrera = await this.inscripcionRepository.query(`

    SELECT
      carrera_autorizada.id, 
      carrera_tipo.carrera
    FROM
      carrera_autorizada
      INNER JOIN
      carrera_tipo
      ON 
      carrera_autorizada.carrera_tipo_id = carrera_tipo.id   
      where carrera_autorizada.id = ${carreraAutorizadaId} 

    `);

    const txtCarrera = carrera[0]['carrera'];

    const data = await this.inscripcionRepository.query(`
   
      SELECT
       
        carrera_tipo.carrera as "CARRERA", 
        (select denominacion from plan_estudio_carrera where id = instituto_plan_estudio_carrera.id ) as "PLAN ESTUDIO",    
        matricula_estudiante.gestion_tipo_id as "GESTION", 
        (select periodo from periodo_tipo where id  = matricula_estudiante.periodo_tipo_id) as "PERIODO", 
        matricula_estudiante.doc_matricula AS "NRO.MATRICULA",        
        persona.carnet_identidad AS "DOC. IDENTIDAD", 
        persona.complemento AS "COMPLEMENTO", 
        persona.paterno AS "APELLIDO PATERNO", 
        persona.materno AS "APELLIDO MATERNO", 
        persona.nombre AS "NOMBRES",       
        institucion_educativa.institucion_educativa AS "INSTITUTO"
      FROM
        carrera_autorizada
        INNER JOIN
        instituto_plan_estudio_carrera
        ON 
          carrera_autorizada."id" = instituto_plan_estudio_carrera.carrera_autorizada_id
        INNER JOIN
        matricula_estudiante
        ON 
          instituto_plan_estudio_carrera.id = matricula_estudiante.instituto_plan_estudio_carrera_id
        INNER JOIN
        carrera_tipo
        ON 
          carrera_autorizada.carrera_tipo_id = carrera_tipo.id
        INNER JOIN
        institucion_educativa_estudiante
        ON 
          matricula_estudiante.institucion_educativa_estudiante_id = institucion_educativa_estudiante.id
        INNER JOIN
        persona
        ON 
          institucion_educativa_estudiante.persona_id = persona.id
        INNER JOIN
        institucion_educativa_sucursal
        ON 
          carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id AND
          institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
        INNER JOIN
        institucion_educativa
        ON 
          institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
      WHERE
        carrera_autorizada.id = ${carreraAutorizadaId} and 
        institucion_educativa.id =  ${ieId}  and 
        matricula_estudiante.periodo_tipo_id = ${periodoId} and 
        matricula_estudiante.gestion_tipo_id = ${gestionId} and
        matricula_estudiante.instituto_plan_estudio_carrera_id = ${ipecId}
        order by paterno, materno, nombre
    `);

    console.log("result: ", data);

    let rows = [];
      data.forEach((doc) => {
        rows.push(Object.values(doc));
      });

      //creating a workbook
      let book = new Workbook();

      //adding a worksheet to workbook
      const sheet = book.addWorksheet('sheet1', {views: [{showGridLines: false}]});
      sheet.addRow([`LISTADO DE MATRICULADOS CARRERA ${txtCarrera} - GESTION 2023`]);
      sheet.addRow(["Datos al 28/06/2023"]);

      sheet.getRow(1).font = { size: 16, bold: true };
      sheet.getRow(2).font = { size: 12, bold: true };

      sheet.addRow([]);

       //add the header
      rows.unshift(Object.keys(data[0]));

      //add multiple rows
      sheet.addRows(rows);

      sheet.getRow(1).height = 30.5;
      sheet.getRow(2).height = 30.5;

      [
        "A4",
        "B4",
        "C4",
        "D4",
        "E4",
        "F4",
        "G4",
        "H4",
        "I4",
        "J4",
        "K4"       
      ].map((key) => {
        sheet.getCell(key).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "cccccc" },
        };
        sheet.getCell(key).font = {
          bold: true,
        };
        sheet.getCell(key).border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
      };
      });

      //autosize columns
      sheet.columns.forEach(function (column) {
        var dataMax = 0;
        column.eachCell({ includeEmpty: true }, function (cell) {
          dataMax = cell.value?cell.value.toString().length:0;
        })
        column.width = dataMax < 10 ? 15 : dataMax;
      });


      // write te file
      let File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: `testXls`,
            postfix: ".xlsx",
            mode: parseInt("0600", 8),
          },
          async (err, file) => {
            if (err) throw new BadRequestException(err);

            //write temporary file
            book.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          }
        );
      });

    return File;

    
  }

  //xls de inscritos
  async getXlsAllInscritosByGestion(
    gestionId: number,
    periodoId: number,
    carreraAutorizadaId: number,
    ieId: number,
    ipecId: number
  ) {
    //TODO: aumentar ueId

    const carrera = await this.inscripcionRepository.query(`

    SELECT
      carrera_autorizada.id, 
      carrera_tipo.carrera
    FROM
      carrera_autorizada
      INNER JOIN
      carrera_tipo
      ON 
      carrera_autorizada.carrera_tipo_id = carrera_tipo.id   
      where carrera_autorizada.id = ${carreraAutorizadaId} 

    `);

    const txtCarrera = carrera[0]['carrera'];

    const data = await this.inscripcionRepository.query(`
   
    select 
      carnet_identidad AS "DOCUMENTO IDENTIDAD", 
      complemento AS "COMPLEMENTO", 
      paterno AS "APELLIDO PATERNO", 
      materno AS "APELLIDO MATERNO", 
      nombre AS "NOMBRES", 
      institucion_educativa AS "INSTITUTO"
      from 
    (
    SELECT
           persona.carnet_identidad , 
           persona.complemento , 
           persona.paterno , 
           persona.materno , 
           persona.nombre,        
           institucion_educativa.institucion_educativa,
           (select count(matricula_estudiante_id) from instituto_estudiante_inscripcion where matricula_estudiante_id =  matricula_estudiante.id) as inscrito_en_la_gestion 
         FROM
           carrera_autorizada
           INNER JOIN
           instituto_plan_estudio_carrera
           ON 
             carrera_autorizada."id" = instituto_plan_estudio_carrera.carrera_autorizada_id
           INNER JOIN
           matricula_estudiante
           ON 
             instituto_plan_estudio_carrera.id = matricula_estudiante.instituto_plan_estudio_carrera_id
           INNER JOIN
           carrera_tipo
           ON 
             carrera_autorizada.carrera_tipo_id = carrera_tipo.id
           INNER JOIN
           institucion_educativa_estudiante
           ON 
             matricula_estudiante.institucion_educativa_estudiante_id = institucion_educativa_estudiante.id
           INNER JOIN
           persona
           ON 
             institucion_educativa_estudiante.persona_id = persona.id
           INNER JOIN
           institucion_educativa_sucursal
           ON 
             carrera_autorizada.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id AND
             institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
           INNER JOIN
           institucion_educativa
           ON 
             institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
         WHERE
         carrera_autorizada.id = ${carreraAutorizadaId} and 
         institucion_educativa.id =  ${ieId}  and 
         matricula_estudiante.periodo_tipo_id = ${periodoId} and 
         matricula_estudiante.gestion_tipo_id = ${gestionId} and
         matricula_estudiante.instituto_plan_estudio_carrera_id = ${ipecId}
           order by paterno, materno, nombre
         ) as data 
         where inscrito_en_la_gestion <> 0
         
     
    `);

    console.log("result: ", data);

    let rows = [];
      data.forEach((doc) => {
        rows.push(Object.values(doc));
      });

      //creating a workbook
      let book = new Workbook();

      //adding a worksheet to workbook
      //let sheet = book.addWorksheet("sheet1");
      const sheet = book.addWorksheet('sheet1', {views: [{showGridLines: false}]});
      
      sheet.addRow([]);
      sheet.addRow([`LISTADO DE INSCRITOS CARRERA ${txtCarrera}`]);
      sheet.addRow(["GESTION 2023"]);

      sheet.getRow(1).font = { size: 16, bold: true };
      sheet.getRow(2).font = { size: 12, bold: true };

      sheet.addRow([]);

       //add the header
      rows.unshift(Object.keys(data[0]));

      //add multiple rows
      sheet.addRows(rows);

      sheet.getRow(1).height = 50.5;
      sheet.getRow(2).height = 30.5;

      [
        "A5",
        "B5",
        "C5",
        "D5",
        "E5",
        "F5",         
      ].map((key) => {
        sheet.getCell(key).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "cccccc" },
        };
        sheet.getCell(key).font = {
          bold: true,
        };
        sheet.getCell(key).border = {
          top: {style:'thin'},
          left: {style:'thin'},
          bottom: {style:'thin'},
          right: {style:'thin'}
      };
      });

      //autosize columns
      sheet.columns.forEach(function (column) {
        var dataMax = 0;
        column.eachCell({ includeEmpty: true }, function (cell) {
          dataMax = cell.value?cell.value.toString().length:0;
        })
        column.width = dataMax < 10 ? 15 : dataMax;
      });

      //para la imagen
      const myBase64Image = "data:image/png;base64,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"
      const imageId2 = book.addImage({
        base64: myBase64Image,
        extension: 'png',
      });

      sheet.addImage(imageId2, 'A1:B1');
      

     
     
      // write te file
      let File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: `Inscritos_`,
            postfix: ".xlsx",
            mode: parseInt("0600", 8),
          },
          async (err, file) => {
            if (err) throw new BadRequestException(err);

            //write temporary file
            book.xlsx
              .writeFile(file)
              .then((_) => {
                resolve(file);
              })
              .catch((err) => {
                throw new BadRequestException(err);
              });
          }
        );
      });

    return File;

    
  }


}
