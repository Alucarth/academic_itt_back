import { Injectable, HttpStatus, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MaestroInscripcion } from "src/academico/entidades/maestroInscripcion.entity";
import { Repository } from "typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { CreateMaestroInscripcionDto } from "./dto/createMaestroInscripcion.dto";
import { Persona } from "src/users/entity/persona.entity";
import { InstitucionEducativa } from "src/academico/entidades/institucionEducativa.entity";
import { InstitucionEducativaSucursal } from "src/academico/entidades/institucionEducativaSucursal.entity";
import { FormacionTipo } from "src/academico/entidades/formacionTipo.entity";
import { FinanciamientoTipo } from "src/academico/entidades/financiamientoTipo.entity";
import { EspecialidadTipo } from "src/academico/entidades/especialidadTipo.entity";
import { CargoTipo } from "src/academico/entidades/cargoTipo.entity";
import { GestionTipo } from "src/academico/entidades/gestionTipo.entity";
import { IdiomaTipo } from "src/academico/entidades/idiomaTipo.entity";
import { PeriodoTipo } from "src/academico/entidades/periodoTipo.entity";
import { UpdateMaestroInscripcionDto } from "./dto/updateMaestroInscripcion.dto";
import { InstitucionEducativaSucursalRepository } from "../institucion_educativa_sucursal/institucion_educativa_sucursal.repository";
import { UpdateMaestroInscripcionDatoDto } from "./dto/updateMaestroInscripcionDato.dto";
import { UsersService } from '../../../users/users.service'
import { JwtService } from "@nestjs/jwt";

//para exportar a xls
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { writeFile } from "fs/promises";


@Injectable()
export class MaestroInscripcionService {
  constructor(
    @InjectRepository(MaestroInscripcion)
    private maestroRepository: Repository<MaestroInscripcion>,
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(MaestroInscripcion)
    private maeRepository: Repository<MaestroInscripcion>,

    @InjectRepository(InstitucionEducativaSucursal)
    private iesRepository: Repository<InstitucionEducativaSucursal>,
    @Inject(InstitucionEducativaSucursalRepository)
    private institucionEducativaSucursalRepository: InstitucionEducativaSucursalRepository,

    @InjectRepository(FormacionTipo)
    private formacionRepository: Repository<FormacionTipo>,
    @InjectRepository(FinanciamientoTipo)
    private ftipoRepository: Repository<FinanciamientoTipo>,
    @InjectRepository(EspecialidadTipo)
    private espeTipoRepository: Repository<EspecialidadTipo>,
    @InjectRepository(CargoTipo)
    private cargoTipoRepository: Repository<CargoTipo>,
    @InjectRepository(GestionTipo)
    private gestionTipoRepository: Repository<GestionTipo>,
    @InjectRepository(IdiomaTipo)
    private idiomaRepository: Repository<IdiomaTipo>,
    @InjectRepository(PeriodoTipo)
    private periodoRepository: Repository<PeriodoTipo>,
    private _serviceResp: RespuestaSigedService,
    private readonly usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async getAllDocentesByUeGestionPeriodo(ueId, gestion, periodo) {
    console.log("ueId: ", ueId);

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} 
            and maestro_inscripcion.gestion_tipo_id = ${gestion} 
            and maestro_inscripcion.periodo_tipo_id = ${periodo} and cargo_tipo_id in (1) 
            order by 2,3,4;`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllDocentesByUeGestion(
    ueId: number,
    gestionId: number,
    periodoId: number
  ) {
    console.log("ueId: ", ueId);

    /* old con periodo
    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} 
            and maestro_inscripcion.gestion_tipo_id = ${gestionId} 
            and cargo_tipo_id in (1) 
            and maestro_inscripcion.periodo_tipo_id = ${periodoId}
            order by 2,3,4;`);*/

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} 
            and maestro_inscripcion.gestion_tipo_id = ${gestionId}                       
            order by 2,3,4;`);

    //and cargo_tipo_id in (1)

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllDirectivosByUeGestion(ueId: string) {
    console.log("ueId: ", ueId);

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} and maestro_inscripcion.gestion_tipo_id = 2023 and cargo_tipo_id in (2,12) 
            order by 2,3,4;`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getAllAdministrativosByUeGestion(ueId: string) {
    console.log("ueId: ", ueId);

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} and maestro_inscripcion.gestion_tipo_id = 2023 
            and cargo_tipo_id in (3,4,5,6,7,14,17) 
            order by 2,3,4;`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getMaestroInscripcionById(id: number) {
    console.log("ueId: ", id);

    /*const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            persona.materno_idioma_tipo_id,
            persona.libreta_militar,
            persona.pasaporte,
            persona.telefono,
            persona.carnet_ibc,
            persona.nacimiento_folio,
            persona.nacimiento_partida,
            persona.nacimiento_libro,
            persona.nacimiento_oficialia,
            persona.codigo_rda,
            persona.doble_nacionalidad,
            persona.tiene_discapacidad,
            persona.codigo_rude,
            persona.email,
            1 as ci_expedido_tipo_id,
            persona.expedido_unidad_territorial_id,

            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            especialidad_tipo.id as especialidad_tipo_id, 
            especialidad_tipo.especialidad, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where maestro_inscripcion.id = ${id};`);*/

    //validamos QUE TIPO DE UNIDAD TERRITORIAL ES ....
    const resultUt = await this.maeRepository.query(`
    SELECT
      maestro_inscripcion.id as maestro_inscripcion_id, 
      persona.id as persona_id,  
      unidad_territorial.id as unidad_territorial_id, 
      unidad_territorial.lugar, 
      unidad_territorial.unidad_territorial_tipo_id, 
      unidad_territorial.unidad_territorial_id, 
      unidad_territorial_tipo.unidad_territorial, 
      unidad_territorial_tipo.comentario
    FROM
      maestro_inscripcion
      INNER JOIN
      persona
      ON 
        maestro_inscripcion.persona_id = persona.id
      INNER JOIN
      unidad_territorial
      ON 
        persona.nacimiento_unidad_territorial_id = unidad_territorial.id
      INNER JOIN
      unidad_territorial_tipo
      ON 
        unidad_territorial.unidad_territorial_tipo_id = unidad_territorial_tipo.id
      WHERE maestro_inscripcion.id = ${id}
    `);

    if(resultUt[0]['unidad_territorial_tipo_id'] == 0)
    {
      //es solo un pais
      const result = await this.maeRepository.query(`
      SELECT
        maestro_inscripcion.ID,
        persona.id as persona_id,
        persona.cedula_tipo_id,
        persona.paterno,
        persona.materno,
        persona.nombre,
        persona.carnet_identidad,
        persona.complemento,
        persona.fecha_nacimiento,
        persona.genero_tipo_id,
        (select genero from genero_tipo where id = persona.genero_tipo_id) as genero,
        persona.estado_civil_tipo_id,
        persona.sangre_tipo_id,
        persona.materno_idioma_tipo_id,
        (select idioma from idioma_tipo where id =  persona.materno_idioma_tipo_id) as materno_idioma_tipo,
        persona.libreta_militar,
        persona.pasaporte,
        persona.telefono,
        persona.carnet_ibc,
        persona.nacimiento_folio,
        persona.nacimiento_partida,
        persona.nacimiento_libro,
        persona.nacimiento_oficialia,
        persona.codigo_rda,
        persona.doble_nacionalidad,
        persona.tiene_discapacidad,
        persona.nacimiento_localidad,
        persona.codigo_rude,
        persona.email,
        1 AS ci_expedido_tipo_id,
        persona.expedido_unidad_territorial_id,
        nacimiento_unidad_territorial_id AS pais_id,   
        0 as depto_id,
        0 as provincia_id,
        0 as municipio_id,
        0 as comunidad_id,
        institucion_educativa_sucursal.institucion_educativa_id,
        institucion_educativa_sucursal.sucursal_codigo,
        institucion_educativa_sucursal.sucursal_nombre,
        formacion_tipo.ID AS formacion_tipo_id,
        formacion_tipo.formacion,
        financiamiento_tipo.ID AS financiamiento_tipo_id,
        financiamiento_tipo.financiamiento,
        cargo_tipo.ID AS cargo_tipo_id,
        cargo_tipo.cargo,
        especialidad_tipo.ID AS especialidad_tipo_id,
        especialidad_tipo.especialidad,
        maestro_inscripcion.gestion_tipo_id,
        maestro_inscripcion.normalista,
        maestro_inscripcion.vigente,
        maestro_inscripcion.formacion_descripcion,
        maestro_inscripcion.braile,
        maestro_inscripcion.asignacion_fecha_inicio,
        maestro_inscripcion.asignacion_fecha_fin,
        maestro_inscripcion.item,
        maestro_inscripcion.periodo_tipo_id,
        maestro_inscripcion.institucion_educativa_sucursal_id,
        ( SELECT lugar FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) AS pais,
        '' as departamento,
        '' as provincia,
        '' as municipio,
        '' as comunidad
      FROM
        maestro_inscripcion
        INNER JOIN persona ON maestro_inscripcion.persona_id = persona.
        ID INNER JOIN institucion_educativa_sucursal ON maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.
        ID INNER JOIN formacion_tipo ON maestro_inscripcion.formacion_tipo_id = formacion_tipo.
        ID INNER JOIN financiamiento_tipo ON maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.
        ID INNER JOIN cargo_tipo ON maestro_inscripcion.cargo_tipo_id = cargo_tipo.
        ID INNER JOIN especialidad_tipo ON maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.ID 
      WHERE
        maestro_inscripcion.ID =  ${id}
      `);

      if (result.length === 0) {
        //throw new NotFoundException('No se encontraron registros');
        return this._serviceResp.respuestaHttp404(
          result,
          "Registro No Encontrado !!",
          ""
        );
      }
  
      //return result;
      return this._serviceResp.respuestaHttp201(
        result,
        "Registro Encontrado !!",
        ""
      );
    }else
    {
      //llega hasta comunidad

      const result = await this.maeRepository.query(`
        SELECT
          data2.*,
          ut.lugar AS comunidad,
          muni.lugar AS municipio,
          prov.lugar AS provincia,
          dep.lugar AS departamento,
          pais.lugar AS pais 
        FROM
          (
          SELECT DATA
            .*,
            ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = DATA.provincia_id ) AS depto_id,
            ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID IN ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = DATA.provincia_id ) ) AS pais_id 
          FROM
            (
            SELECT
              maestro_inscripcion.ID,
              persona.id as persona_id,
              persona.cedula_tipo_id,
              persona.paterno,
              persona.materno,
              persona.nombre,
              persona.carnet_identidad,
              persona.complemento,
              persona.fecha_nacimiento,
              persona.genero_tipo_id,
              (select genero from genero_tipo where id = persona.genero_tipo_id) as genero,
              persona.estado_civil_tipo_id,
              persona.sangre_tipo_id,
              persona.materno_idioma_tipo_id,
              (select idioma from idioma_tipo where id =  persona.materno_idioma_tipo_id) as materno_idioma_tipo,
              persona.libreta_militar,
              persona.pasaporte,
              persona.telefono,
              persona.carnet_ibc,
              persona.nacimiento_folio,
              persona.nacimiento_partida,
              persona.nacimiento_libro,
              persona.nacimiento_oficialia,
              persona.codigo_rda,
              persona.doble_nacionalidad,
              persona.tiene_discapacidad,
              persona.nacimiento_localidad,
              persona.codigo_rude,
              persona.email,
              1 AS ci_expedido_tipo_id,
              persona.expedido_unidad_territorial_id,
              nacimiento_unidad_territorial_id AS comunidad_id,
              ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) AS municipio_id,
              ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID IN ( SELECT unidad_territorial_id FROM unidad_territorial WHERE ID = nacimiento_unidad_territorial_id ) ) AS provincia_id,
              institucion_educativa_sucursal.institucion_educativa_id,
              institucion_educativa_sucursal.sucursal_codigo,
              institucion_educativa_sucursal.sucursal_nombre,
              formacion_tipo.ID AS formacion_tipo_id,
              formacion_tipo.formacion,
              financiamiento_tipo.ID AS financiamiento_tipo_id,
              financiamiento_tipo.financiamiento,
              cargo_tipo.ID AS cargo_tipo_id,
              cargo_tipo.cargo,
              especialidad_tipo.ID AS especialidad_tipo_id,
              especialidad_tipo.especialidad,
              maestro_inscripcion.gestion_tipo_id,
              maestro_inscripcion.normalista,
              maestro_inscripcion.vigente,
              maestro_inscripcion.formacion_descripcion,
              maestro_inscripcion.braile,
              maestro_inscripcion.asignacion_fecha_inicio,
              maestro_inscripcion.asignacion_fecha_fin,
              maestro_inscripcion.item,
              maestro_inscripcion.periodo_tipo_id,
              maestro_inscripcion.institucion_educativa_sucursal_id
            FROM
              maestro_inscripcion
              INNER JOIN persona ON maestro_inscripcion.persona_id = persona.
              ID INNER JOIN institucion_educativa_sucursal ON maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.
              ID INNER JOIN formacion_tipo ON maestro_inscripcion.formacion_tipo_id = formacion_tipo.
              ID INNER JOIN financiamiento_tipo ON maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.
              ID INNER JOIN cargo_tipo ON maestro_inscripcion.cargo_tipo_id = cargo_tipo.
              ID INNER JOIN especialidad_tipo ON maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.ID 
            WHERE
              maestro_inscripcion.ID = ${id} 
            ) AS DATA 
          ) AS data2
          LEFT JOIN unidad_territorial ut ON ut.ID = data2.comunidad_id
          LEFT JOIN unidad_territorial muni ON muni.ID = data2.municipio_id
          LEFT JOIN unidad_territorial prov ON prov.ID = data2.provincia_id
          LEFT JOIN unidad_territorial dep ON dep.ID = data2.depto_id
          LEFT JOIN unidad_territorial pais ON pais.ID = data2.pais_id
      `);

      if (result.length === 0) {
        //throw new NotFoundException('No se encontraron registros');
        return this._serviceResp.respuestaHttp404(
          result,
          "Registro No Encontrado !!",
          ""
        );
      }
  
      //return result;
      return this._serviceResp.respuestaHttp201(
        result,
        "Registro Encontrado !!",
        ""
      );
    }

   

    /*console.log("result: ", result);
    console.log("result size: ", result.length);*/

    /*result[0].genero = {
      id: result[0].genero_tipo_id,
      genero: result[0].genero,
    };
    console.log("result2: ", result);
    */

    
  }

  async getMaestroInscripcionByPersonaGestionPeriodo(
    id: number,
    gestion: number,
    periodo: number,
    sie: number
  ) {
    console.log("ueId: ", id);

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
           
            where persona.id = ${id}
            and  maestro_inscripcion.gestion_tipo_id = ${gestion}
            and maestro_inscripcion.periodo_tipo_id = ${periodo}
            and institucion_educativa_sucursal.institucion_educativa_id = ${sie}`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async getMaestroInscripcionByPersonaGestionPeriodoCargo(
    id: number,
    gestion: number,
    periodo: number,
    sie: number,
    cargo: number
  ) {
    console.log("ueId: ", id);

    const result = await this.maeRepository.query(`
        SELECT
            maestro_inscripcion.id, 
            persona.paterno, 
            persona.materno, 
            persona.nombre, 
            persona.carnet_identidad, 
            persona.complemento, 
            persona.fecha_nacimiento, 
            persona.genero_tipo_id, 
            persona.estado_civil_tipo_id, 
            persona.sangre_tipo_id, 
            institucion_educativa_sucursal.institucion_educativa_id, 
            institucion_educativa_sucursal.sucursal_codigo, 
            institucion_educativa_sucursal.sucursal_nombre, 
            formacion_tipo.id as formacion_tipo_id, 
            formacion_tipo.formacion, 
            financiamiento_tipo.id as financiamiento_tipo_id, 
            financiamiento_tipo.financiamiento, 
            cargo_tipo.id as cargo_tipo_id, 
            cargo_tipo.cargo, 
            maestro_inscripcion.gestion_tipo_id, 
            maestro_inscripcion.normalista, 
            maestro_inscripcion.vigente, 
            maestro_inscripcion.formacion_descripcion, 
            maestro_inscripcion.braile, 
            maestro_inscripcion.asignacion_fecha_inicio, 
            maestro_inscripcion.asignacion_fecha_fin, 
            maestro_inscripcion.item, 
            maestro_inscripcion.periodo_tipo_id
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
           
            where persona.id = ${id}
            and  maestro_inscripcion.gestion_tipo_id = ${gestion}
            and maestro_inscripcion.periodo_tipo_id = ${periodo}
            and maestro_inscripcion.cargo_tipo_id = ${cargo}
            and institucion_educativa_sucursal.institucion_educativa_id = ${sie}`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      //throw new NotFoundException('No se encontraron registros');
      return this._serviceResp.respuestaHttp404(
        result,
        "Registro No Encontrado !!",
        ""
      );
    }

    //return result;
    return this._serviceResp.respuestaHttp201(
      result,
      "Registro Encontrado !!",
      ""
    );
  }

  async createUpdateMaestroInscripcion(
    dto: CreateMaestroInscripcionDto,
    request
  ) {
    //0: validar token
    let user_id = 0;
    //console.log("updateUser:", request.headers["token"]);
    /*try {
      const payload = await this.jwtService.decode(request.headers["token"]);
      //console.log("payload:", payload["id"]);
      if (!payload) {
        throw new UnauthorizedException();
      }
      user_id = parseInt(payload["id"]) + 0;
    } catch {
      throw new UnauthorizedException();
    }
    console.log("postUserId:", user_id);*/

    /*console.log("dto.personaId -> ",dto.personaId);
    console.log("dto.gestionTipoId ->", dto.gestionTipoId);
    console.log("dto.periodoTipoId -> ",dto.periodoTipoId);
    console.log("dto.institucionEducativaId -> ", dto.institucionEducativaId);*/


    const maestroInscripcion =
      //await this.getMaestroInscripcionByPersonaGestionPeriodo(
      //verificamos si ya existe con le mismo cargo
      await this.getMaestroInscripcionByPersonaGestionPeriodoCargo(
        dto.personaId,
        dto.gestionTipoId,
        55, //TODO: esto hay que modificar, segun periodo dto.periodoTipoId,
        dto.institucionEducativaId,
        dto.cargoTipoId
      );

    console.log('maestroInscripcion -> ', maestroInscripcion);
    //return;

    if (maestroInscripcion.data.length === 0) {
      console.log("inserta");
      return await this.createNewMaestroInscripcion(dto,user_id);
    } else {
      /*let datos = {
        id: Number(maestroInscripcion.data[0].id),
        formacionTipoId: dto.formacionTipoId,
        financiamientoTipoId: dto.financiamientoTipoId,
        cargoTipoId: dto.cargoTipoId,
        especialidadTipoId: 0,
        vigente: true,
        normalista: dto.normalista,
        braile: dto.braile,
        estudioIdiomaTipoId: dto.estudioIdiomaTipoId,
        asignacionFechaInicio: dto.asignacionFechaInicio,
        asignacionFechaFin: dto.asignacionFechaFin,
        item: dto.item,
        formacionDescripcion: dto.formacionDescripcion,
      };
      return await this.updateMaestroInscripcionByDato(datos);*/

      return this._serviceResp.respuestaHttp400(
        "Datos ya existen",
        "Registro Encontrado en la misma Institucion, gestion y periodo !!",
        ""
      );
    }
  }

  async createNewMaestroInscripcion(dto: CreateMaestroInscripcionDto, user_id:number) {
    //1:BUSCAR LA PERSONA
    const persona = await this.personaRepository.findOne({
      where: { id: dto.personaId },
    });
    //console.log("persona:", persona);

    if (!persona) {
      return this._serviceResp.respuestaHttp404(
        dto.personaId,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const sucursal =
        await this.institucionEducativaSucursalRepository.findSucursalBySieGestion(
          dto.institucionEducativaId,
          dto.gestionTipoId
        );

      if (sucursal) {
        dto.institucionEducativaSucursalId = sucursal.id;
      } else {
        return this._serviceResp.respuestaHttp400(
          "",
          "institucionEducativaSucursalId, Registro No Encontrado !!",
          ""
        );
      }

      let formacionTipo = await this.formacionRepository.findOne({
        where: { id: dto.formacionTipoId },
      });
      //console.log("formacionTipo : ", formacionTipo);
      if (!formacionTipo) {
        return this._serviceResp.respuestaHttp404(
          dto.formacionTipoId,
          "formacionTipoId no Encontrado !!",
          ""
        );
      }

      let financiamientoTipo = await this.ftipoRepository.findOne({
        where: { id: dto.financiamientoTipoId },
      });
      //console.log("financiamientoTipo : ", financiamientoTipo);

      let cargoTipo = await this.cargoTipoRepository.findOne({
        where: { id: dto.cargoTipoId },
      });
      //console.log("cargoTipo : ", cargoTipo);
      if (!cargoTipo) {
        return this._serviceResp.respuestaHttp404(
          dto.cargoTipoId,
          "cargoTipoId no Encontrado !!",
          ""
        );
      }

      let especialidadTipo = await this.espeTipoRepository.findOne({
        where: { id: dto.especialidadTipoId ? dto.especialidadTipoId : 0 },
      });
      //console.log("especialidadTipo : ", especialidadTipo);

      let gestionTipo = await this.gestionTipoRepository.findOne({
        where: { id: dto.gestionTipoId },
      });
      //console.log("gestionTipo : ", gestionTipo);
      if (!gestionTipo) {
        return this._serviceResp.respuestaHttp404(
          dto.gestionTipoId,
          "gestionTipoId no Encontrado !!",
          ""
        );
      }

      let idiomaTipo = await this.idiomaRepository.findOne({
        where: { id: dto.estudioIdiomaTipoId },
      });
      //console.log("idiomaTipo : ", idiomaTipo);
      if (!idiomaTipo) {
        return this._serviceResp.respuestaHttp404(
          dto.estudioIdiomaTipoId,
          "estudioIdiomaTipoId no Encontrado !!",
          ""
        );
      }

      let periodoTipo = await this.periodoRepository.findOne({
        //where: { id: dto.periodoTipoId },
        where: { id: 55 }, //TODOS COMO ANUAL
      });
      //console.log("periodoTipo : ", periodoTipo);
      if (!periodoTipo) {
        return this._serviceResp.respuestaHttp404(
          dto.periodoTipoId,
          "periodoTipoId no Encontrado !!",
          ""
        );
      }

      //TODO: no hay periodo_tipo_id en el entity, va ? no va ? alguien sabe ?

      const res = await this.personaRepository
        .createQueryBuilder()
        .insert()
        .into(MaestroInscripcion)
        .values([
          {
            persona                     : persona,
            institucionEducativaSucursal: sucursal,
            formacionTipo               : formacionTipo,
            financiamientoTipo          : financiamientoTipo,
            cargoTipo                   : cargoTipo,
            especialidadTipo            : especialidadTipo,
            gestionTipo                 : gestionTipo,
            normalista                  : dto.normalista,
            formacionDescripcion        : dto.formacionDescripcion,
            braile                      : dto.braile,
            estudioIdiomaTipo           : idiomaTipo,
            asignacionFechaInicio       : dto.asignacionFechaInicio,
            asignacionFechaFin          : dto.asignacionFechaFin,
            item                        : dto.item,
            maestroInscripcionIdAm      : dto.maestroInscripcionIdAm,
            periodoTipo                 : periodoTipo,
            usuarioId                   : user_id
          },
        ])
        .returning("id")
        .execute();

      //SE CREA EL USUARIO SOLO SI ES MAESTRO O SECRETARIO,
      //PARA LOS DEMAS CARGOS NO SE CREAN USUARIOS COMO portero,regente, etc
      //ROL DIRECTOR: se debe crear desde otro lugar, modulo departamental
      
      //si es secretario se crea como rol director: 5 segun Cristina...capaz de creerle
      if( dto.cargoTipoId === 3 ){
        const newusuario = await this.usersService.createUserAndRol(persona, 5);
      }
      // 6: ROL MAESTRO
      if( dto.cargoTipoId === 1 ){
        const newusuario = await this.usersService.createUserAndRol(persona, 6);
      }

      console.log("res:", res);
      console.log("Docente adicionado, usuario creado!");
      return this._serviceResp.respuestaHttp201(
        res.identifiers,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar maestro inscripcion: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar maestro inscripcion: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async updateMaestroInscripcion(dto: UpdateMaestroInscripcionDto) {
    //1:BUSCAR el registro
    const result = await this.personaRepository.query(
      `SELECT * FROM maestro_inscripcion where id = ${dto.id}`
    );

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      return this._serviceResp.respuestaHttp404(
        dto.id,
        "Registro No Encontrado !!",
        ""
      );
    }

    //2:BUSCAR LA PERSONA
    const persona = await this.personaRepository.findOne({
      where: { id: dto.personaId },
    });
    console.log("persona:", persona);

    if (!persona) {
      return this._serviceResp.respuestaHttp404(
        dto.personaId,
        "Persona No Encontrada !!",
        ""
      );
    }

    /* institucionEducativaSucursal */
    let institucionEducativaSucursal = await this.iesRepository.findOne({
      where: { id: dto.institucionEducativaSucursalId },
    });
    console.log(
      "institucionEducativaSucursal : ",
      institucionEducativaSucursal
    );
    if (!institucionEducativaSucursal) {
      return this._serviceResp.respuestaHttp404(
        dto.institucionEducativaSucursalId,
        "institucionEducativaSucursal No Encontrada !!",
        ""
      );
    }

    /* formacionTipo */
    let formacionTipo = await this.formacionRepository.findOne({
      where: { id: dto.formacionTipoId },
    });
    console.log("formacionTipo : ", formacionTipo);
    if (!formacionTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.formacionTipoId,
        "formacionTipo No Encontrada !!",
        ""
      );
    }
    /** financiamientoTipo */
    let financiamientoTipo = await this.ftipoRepository.findOne({
      where: { id: dto.financiamientoTipoId },
    });
    console.log("financiamientoTipo : ", financiamientoTipo);
    if (!financiamientoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.financiamientoTipoId,
        "financiamiento No Encontrada !!",
        ""
      );
    }

    /** cargoTipo */
    let cargoTipo = await this.cargoTipoRepository.findOne({
      where: { id: dto.cargoTipoId },
    });
    console.log("cargoTipo : ", cargoTipo);
    if (!cargoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.cargoTipoId,
        "cargoTipoId No Encontrada !!",
        ""
      );
    }

    /** especialidadTipo */
    let especialidadTipo = await this.espeTipoRepository.findOne({
      where: { id: dto.especialidadTipoId },
    });
    console.log("especialidadTipo : ", especialidadTipo);
    if (!especialidadTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.especialidadTipoId,
        "especialidadTipo No Encontrada !!",
        ""
      );
    }

    /** gestionTipo */
    let gestionTipo = await this.gestionTipoRepository.findOne({
      where: { id: dto.gestionTipoId },
    });
    console.log("gestionTipo : ", gestionTipo);
    if (!gestionTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.gestionTipoId,
        "gestionTipo No Encontrada !!",
        ""
      );
    }

    /** idiomaTipo */
    let idiomaTipo = await this.idiomaRepository.findOneBy({
      id: dto.estudioIdiomaTipoId,
    });
    console.log("idiomaTipoxxx : ", idiomaTipo);
    if (!idiomaTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.estudioIdiomaTipoId,
        "idiomaTipo No Encontrada !!",
        ""
      );
    }

    try {
      //let periodoTipo = await this.periodoRepository.findOne({
      //  where: { id: dto.periodoTipoId },
      //});
      //console.log("periodoTipo : ", periodoTipo);

      //TODO: no hay periodo_tipo_id en el entity, va ? no va ? alguien sabe ?

      /*const res =  await this.maestroRepository
        .update({ id: dto.id }, dto)*/

      if (dto.estudioIdiomaTipoId == 0) {
        const res = await this.maestroRepository
          .createQueryBuilder()
          .update(MaestroInscripcion)
          .set({
            persona: persona,
            //institucionEducativaSucursal: institucionEducativaSucursal,
            formacionTipo        : formacionTipo,
            financiamientoTipo   : financiamientoTipo,
            cargoTipo            : cargoTipo,
            especialidadTipo     : especialidadTipo,
            gestionTipo          : gestionTipo,
            normalista           : dto.normalista,
            formacionDescripcion : dto.formacionDescripcion,
            braile               : dto.braile,
            asignacionFechaInicio: dto.asignacionFechaInicio,
            asignacionFechaFin   : dto.asignacionFechaFin,
            item                 : dto.item,
            //maestroInscripcionIdAm: dto.maestroInscripcionIdAm,
          })
          .where("id = :id", { id: dto.id })
          .execute();

        console.log("res:", res);
        console.log("Maestro Inscripcion actualizado");
        return this._serviceResp.respuestaHttp202(
          null,
          "Registro Actualizado !!",
          ""
        );
      } else {
        const res = await this.maestroRepository
          .createQueryBuilder()
          .update(MaestroInscripcion)
          .set({
            persona: persona,
            //institucionEducativaSucursal: institucionEducativaSucursal,
            formacionTipo        : formacionTipo,
            financiamientoTipo   : financiamientoTipo,
            cargoTipo            : cargoTipo,
            especialidadTipo     : especialidadTipo,
            gestionTipo          : gestionTipo,
            normalista           : dto.normalista,
            formacionDescripcion : dto.formacionDescripcion,
            braile               : dto.braile,
            estudioIdiomaTipo    : idiomaTipo,
            asignacionFechaInicio: dto.asignacionFechaInicio,
            asignacionFechaFin   : dto.asignacionFechaFin,
            item                 : dto.item,
            //maestroInscripcionIdAm: dto.maestroInscripcionIdAm,
          })
          .where("id = :id", { id: dto.id })
          .execute();

        console.log("res:", res);
        console.log("Maestro Inscripcion actualizado");
        return this._serviceResp.respuestaHttp202(
          null,
          "Registro Actualizado !!",
          ""
        );
      }
    } catch (error) {
      console.log("Error update maestro inscripcion: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error update maestro inscripcion: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async updateMaestroInscripcionByDato(dto: UpdateMaestroInscripcionDatoDto) {
    //1:BUSCAR el registro
    console.log(dto);
    console.log("fin de el dto");
    /* formacionTipo */
    let formacionTipo = await this.formacionRepository.findOne({
      where: { id: dto.formacionTipoId },
    });
    console.log("formacionTipo : ", formacionTipo);
    if (!formacionTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.formacionTipoId,
        "formacionTipo No Encontrada !!",
        ""
      );
    }
    /** financiamientoTipo */
    let financiamientoTipo = await this.ftipoRepository.findOne({
      where: { id: dto.financiamientoTipoId },
    });
    console.log("financiamientoTipo : ", financiamientoTipo);
    if (!financiamientoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.financiamientoTipoId,
        "financiamiento No Encontrada !!",
        ""
      );
    }

    /** cargoTipo */
    let cargoTipo = await this.cargoTipoRepository.findOne({
      where: { id: dto.cargoTipoId },
    });
    console.log("cargoTipo : ", cargoTipo);
    if (!cargoTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.cargoTipoId,
        "cargoTipoId No Encontrada !!",
        ""
      );
    }

    /** especialidadTipo */
    let especialidadTipo = await this.espeTipoRepository.findOne({
      where: { id: dto.especialidadTipoId ? dto.especialidadTipoId : 0 },
    });
    console.log("especialidadTipo : ", especialidadTipo);
    if (!especialidadTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.especialidadTipoId,
        "especialidadTipo No Encontrada !!",
        ""
      );
    }

    /** idiomaTipo */
    let idiomaTipo = await this.idiomaRepository.findOne({
      where: { id: dto.estudioIdiomaTipoId },
    });
    console.log("idiomaTipoxxx : ", idiomaTipo);
    if (!idiomaTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.estudioIdiomaTipoId,
        "idiomaTipo No Encontrada !!",
        ""
      );
    }
    console.log("here---");

    try {
      console.log(dto);
      console.log("------fin----------");

      const res = await this.maestroRepository
        .createQueryBuilder()
        .update(MaestroInscripcion)
        .set({
          formacionTipo     : formacionTipo,
          financiamientoTipo: financiamientoTipo,
          cargoTipo         : cargoTipo,
          // especialidadTipo: especialidadTipo,
          normalista           : dto.normalista,
          formacionDescripcion : dto.formacionDescripcion,
          braile               : dto.braile,
          estudioIdiomaTipo    : idiomaTipo,
          asignacionFechaInicio: dto.asignacionFechaInicio,
          asignacionFechaFin   : dto.asignacionFechaFin,
          item                 : dto.item,
        })
        .where("id = :id", { id: dto.id })
        .execute();

      console.log("res:", res);
      console.log("Maestro Inscripcion actualizado");
      return this._serviceResp.respuestaHttp202(
        res,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update maestro inscripcion: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error update maestro inscripcion: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async changeStatusById(body) {
    //TODO: validar body
    const result = await this.personaRepository.query(
      `SELECT * FROM maestro_inscripcion where id = ${body.maestroInscripcionId}`
    );

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {
      return this._serviceResp.respuestaHttp404(
        body.maestroInscripcionId,
        "Registro No Encontrado !!",
        ""
      );
    }

    try {
      const nuevoEstado = !result[0].vigente;

      await this.personaRepository
        .createQueryBuilder()
        .update(MaestroInscripcion)
        .set({
          vigente: nuevoEstado,
        })
        .where("id = :id", { id: body.maestroInscripcionId })
        .execute();

      return this._serviceResp.respuestaHttp202(
        body.maestroInscripcionId,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error update user: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error Actualizando Estado Usuario: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
      //return 0;
    }
  }

  async getTotalDocentes(){
    const total = await this.maeRepository
    .createQueryBuilder("me")
    .innerJoin("me.institucionEducativaSucursal", "s")
    .innerJoin("s.institucionEducativa", "i")
    .where('i.educacionTipoId in (7,8,9)')
    .getCount();
    
    return total 
  }
  async findListaDocentesRegimenDepartamento(){
    return await this.maeRepository
      .createQueryBuilder("mi")
      .innerJoinAndSelect("mi.institucionEducativaSucursal", "s")
      .innerJoinAndSelect("s.institucionEducativa", "i")
      .innerJoinAndSelect("i.jurisdiccionGeografica", "h")
      .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
      .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
      .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
      .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
      .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
      .innerJoinAndSelect("i.acreditados", "e")
      .innerJoin("e.dependenciaTipo", "g")
      .select([
        "up4.lugar as departamento",
        "up4.id as departamento_id",
        "g.dependencia as dependencia",
        "g.id as dependencia_id",
        "COUNT(mi.id) as total", 
      ])
      .where('i.educacionTipoId in (7,8,9)')
      .groupBy('up4.id')
      .addGroupBy('g.dependencia')
      .addGroupBy('g.id')
      .getRawMany();
}
  async findListaDocentesFinanciamiento(lugar, dependencia){
    return await this.maeRepository
      .createQueryBuilder("mi")
      .innerJoinAndSelect("mi.financiamientoTipo", "ft")
      .innerJoinAndSelect("mi.institucionEducativaSucursal", "s")
      .innerJoinAndSelect("s.institucionEducativa", "i")
      .innerJoinAndSelect("i.jurisdiccionGeografica", "h")
      .innerJoinAndSelect("h.localidadUnidadTerritorial2001", "u1")
      .innerJoinAndSelect("u1.unidadTerritorialPadre", "up1")
      .innerJoinAndSelect("up1.unidadTerritorialPadre", "up2")
      .innerJoinAndSelect("up2.unidadTerritorialPadre", "up3")
      .innerJoinAndSelect("up3.unidadTerritorialPadre", "up4")
      .innerJoinAndSelect("i.acreditados", "e")
      .innerJoin("e.dependenciaTipo", "g")
      .innerJoin("mi.aulasDocentes", "ad")
      .innerJoin("ad.aula", "au")
      .innerJoin("au.ofertaCurricular", "o")
      .innerJoin("o.institutoPlanEstudioCarrera", "ipec")
      .innerJoin("ipec.carreraAutorizada", "ca")
      .innerJoin("ca.carreraTipo", "ct")
      .select([
        "i.institucion_educativa as institucion_educativa",
        "ct.carrera as carrera",
        "ft.financiamiento",
        "COUNT(mi.id) as total_financiamiento", 
      ])
      .where('i.educacionTipoId in (7,8,9)')
      .andWhere('ca.areaTipoId > 1')
      .andWhere('e.dependenciaTipoId = :dependencia ', { dependencia })
      .andWhere('up4.id = :lugar ', { lugar })
      .groupBy('ct.carrera')
      .addGroupBy('i.institucion_educativa')
      .addGroupBy('ft.financiamiento')
      .getRawMany();
}

  async getXlsAllDocentesByUeGestion(
    ueId: number,
    gestionId: number,
    periodoId: number
    ){

    const instituto = await this.maeRepository.query(`

    SELECT
      institucion_educativa
    FROM
      institucion_educativa 
      where id = ${ueId} 

    `);

    const txtInstituto = instituto[0]['institucion_educativa'];

      const data = await this.maeRepository.query(`
        SELECT           
            persona.paterno AS "APELLIDO PATERNO", 
            persona.materno AS "aPELLIDO MATERNO", 
            persona.nombre AS "NOMBRES", 
            persona.carnet_identidad AS "DOC.IDENTIAD", 
            persona.complemento AS "COMPLEMENTO", 
            persona.fecha_nacimiento AS "FECHA NACIMIENTO",             
            formacion_tipo.formacion AS "FORMACION",             
            financiamiento_tipo.financiamiento AS "TIPO FINANCIAMIENTO",            
            cargo_tipo.cargo AS "CARGO",            
            especialidad_tipo.especialidad AS "ESPECIALIDAD",            
            maestro_inscripcion.formacion_descripcion AS "DESCRIPCION", 
            maestro_inscripcion.item AS "ITEM" 
        FROM
            maestro_inscripcion
            INNER JOIN
            persona
            ON 
                maestro_inscripcion.persona_id = persona.id
            INNER JOIN
            institucion_educativa_sucursal
            ON 
                maestro_inscripcion.institucion_educativa_sucursal_id = institucion_educativa_sucursal.id
            INNER JOIN
            formacion_tipo
            ON 
                maestro_inscripcion.formacion_tipo_id = formacion_tipo.id
            INNER JOIN
            financiamiento_tipo
            ON 
                maestro_inscripcion.financiamiento_tipo_id = financiamiento_tipo.id
            INNER JOIN
            cargo_tipo
            ON 
                maestro_inscripcion.cargo_tipo_id = cargo_tipo.id
            INNER JOIN
            especialidad_tipo
            ON 
                maestro_inscripcion.especialidad_tipo_id = especialidad_tipo.id
            where institucion_educativa_id = ${ueId} 
            and maestro_inscripcion.gestion_tipo_id = ${gestionId}                       
            order by 2,3,4;`);

      console.log("result: ", data);
      console.log("result size: ", data.length);

      let rows = [];
      data.forEach((doc) => {
        rows.push(Object.values(doc));
      });

      //creating a workbook
      let book = new Workbook();

      //adding a worksheet to workbook
      let sheet = book.addWorksheet("sheet1");
      
      sheet.addRow([`LISTADO DE DOCENTES Y ADMINISTRATIVOS  ${txtInstituto} - GESTION 2023`]);
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
        "K4",
        "L4"      
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



      // write te file
      let File = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: `Docentes`,
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
