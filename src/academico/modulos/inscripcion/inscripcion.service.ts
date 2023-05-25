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
import { Aula } from "../../entidades/aula.entity";
import { EstadoMatriculaTipo } from "../../entidades/estadoMatriculaTipo.entity";
import { OfertaCurricular } from "../../entidades/ofertaCurricular.entity";

import { CreatePersonaoDto } from "../persona/dto/createPersona.dto";
import { CreateInscriptionDto } from "./dto/createInscription.dto";
import { CreateMatriculaDto } from "./dto/createMatricula.dto";
import { UsersService } from "../../../users/users.service";
import { CreateInscriptionNuevoDto } from "./dto/createInscriptionNuevo.dto";

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
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
    @InjectRepository(EstadoMatriculaTipo)
    private estadoMatriculaRepository: Repository<EstadoMatriculaTipo>,
    @InjectRepository(OfertaCurricular)
    private ofertaCurricularRepository: Repository<OfertaCurricular>,
    private _serviceResp: RespuestaSigedService,
    private _servicePersona: PersonaService,
    private readonly usersService: UsersService
  ) {}

  async createMatricula(dto: CreateMatriculaDto) {
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
        console.log("ieeId = ", iee[0].id);
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

      //SE CREA EL USUARIO
      // 7: ROL MAESTRO
      const newusuario = await this.usersService.createUserAndRol(
        personaAux,
        7
      );

      console.log("newusuario", newusuario);
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

  async getAllMatriculadosByGestion(
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
        carrera_tipo.carrera 
    FROM
        institucion_educativa_estudiante
        INNER JOIN matricula_estudiante ON institucion_educativa_estudiante.id = matricula_estudiante.institucion_educativa_estudiante_id
        INNER JOIN plan_estudio_carrera ON matricula_estudiante.plan_estudio_carrera_id = plan_estudio_carrera.id
        INNER JOIN carrera_tipo ON plan_estudio_carrera.carrera_tipo_id = carrera_tipo.id
        INNER JOIN institucion_educativa_sucursal ON institucion_educativa_estudiante.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
        INNER JOIN institucion_educativa ON institucion_educativa_sucursal.institucion_educativa_id = institucion_educativa.id
        INNER JOIN persona ON institucion_educativa_estudiante.persona_id = persona.id
    WHERE 
        matricula_estudiante.gestion_tipo_id = ${gestionId} and 
        periodo_tipo_id = ${periodoId} and 
        carrera_tipo.id = ${carreraId} and 
        institucion_educativa.id = ${ieId}
    order by persona.paterno, persona.materno, persona.nombre
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
      .innerJoinAndSelect("i.matriculaEstudiante", "me")
      .innerJoinAndSelect("me.institucionEducativaEstudiante", "ie")
      .innerJoinAndSelect("ie.persona", "p")
      .select([
        'i.id as instituto_estudiante_inscripcion_id',
        'a.id as aula_id',
        'p.paterno as paterno',
        'p.materno as materno',
        'p.nombre as nombre',
        'p.carnetIdentidad as carnet_identidad',
    ])
      .where("i.aulaId = :id ", { id })
      .getRawMany();
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

  async getAllMateriasInscripcionNuevo(carreraAutorizadaId: number) {
    // semestral ? anual ?
    const intervaloGestion = await this.inscripcionRepository.query(`
      SELECT
        carrera_autorizada.id as carrera_autorizada_id, 
        carrera_autorizada_resolucion."id" as carrera_autorizada_resolucion_id, 
        carrera_autorizada_resolucion.descripcion, 
        carrera_autorizada_resolucion.numero_resolucion, 
        intervalo_gestion_tipo.id as intervalo_gestion_tipo_id, 
        intervalo_gestion_tipo.intervalo_gestion
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
        where carrera_autorizada.id = ${carreraAutorizadaId}
    `);

    let regimen_grado_tipo_id = 0;
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 1) {
      // es semestral, el primer semestre es 1
      regimen_grado_tipo_id = 1;
    }
    if (intervaloGestion[0].intervalo_gestion_tipo_id === 4) {
      // es anual, el primer año es 7
      regimen_grado_tipo_id = 7;
    }

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
        regimen_grado_tipo.id = ${regimen_grado_tipo_id}
    `);

    for (let i = 0; i < result.length; i++) {
      let res_paralelos = await this.inscripcionRepository.query(`
        SELECT
          oferta_curricular.id as oferta_curricular_id, 
          aula.id as aula_id, 
          paralelo_tipo.id as paralelo_tipo_id, 
          paralelo_tipo.paralelo, 
          aula.activo
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
          where 
          oferta_curricular.id = ${result[i].oferta_curricular_id}
      `);

      let array_paralelos = res_paralelos;
      result[i].paralelos = array_paralelos;
    }

    /*result.forEach(async element => {
     //console.log(element.oferta_curricular_id);
      let res_paralelos = await this.inscripcionRepository.query(`
        SELECT
          oferta_curricular.id, 
          aula.id, 
          paralelo_tipo.id, 
          paralelo_tipo.paralelo, 
          aula.activo
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
          where 
          oferta_curricular.id = 32
      `);

     let array_paralelos = ['A', 'B'];
     element.paralelos = array_paralelos
    });*/

    //console.log("result: ", result);

    return this._serviceResp.respuestaHttp200(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  //TODO: esto hay que repensar, debe ir por gestion
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
}
