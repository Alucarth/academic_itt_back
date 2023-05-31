import { Injectable, HttpStatus, Inject } from "@nestjs/common";
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
    private readonly usersService: UsersService
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

    console.log("result: ", result);
    console.log("result size: ", result.length);

    /*result[0].genero = {
      id: result[0].genero_tipo_id,
      genero: result[0].genero,
    };
    console.log("result2: ", result);
    */

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

  async createUpdateMaestroInscripcion(dto: CreateMaestroInscripcionDto) {
    const maestroInscripcion =
      await this.getMaestroInscripcionByPersonaGestionPeriodo(
        dto.personaId,
        dto.gestionTipoId,
        dto.periodoTipoId,
        dto.institucionEducativaId
      );

    if (maestroInscripcion.data.length === 0) {
      console.log("inserta");
      return await this.createNewMaestroInscripcion(dto);
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

  async createNewMaestroInscripcion(dto: CreateMaestroInscripcionDto) {
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
            persona: persona,
            institucionEducativaSucursal: sucursal,
            formacionTipo: formacionTipo,
            financiamientoTipo: financiamientoTipo,
            cargoTipo: cargoTipo,
            especialidadTipo: especialidadTipo,
            gestionTipo: gestionTipo,
            normalista: dto.normalista,
            formacionDescripcion: dto.formacionDescripcion,
            braile: dto.braile,
            estudioIdiomaTipo: idiomaTipo,
            asignacionFechaInicio: dto.asignacionFechaInicio,
            asignacionFechaFin: dto.asignacionFechaFin,
            item: dto.item,
            maestroInscripcionIdAm: dto.maestroInscripcionIdAm,
            periodoTipo: periodoTipo,
          },
        ])
        .returning("id")
        .execute();

      //SE CREA EL USUARIO
      // 6: ROL MAESTRO
      const newusuario = await this.usersService.createUserAndRol(persona,6)


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
    let idiomaTipo = await this.idiomaRepository.findOne({
      where: { id: dto.estudioIdiomaTipoId },
    });
    console.log("idiomaTipo : ", idiomaTipo);
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

      const res = await this.maestroRepository
        .createQueryBuilder()
        .update(MaestroInscripcion)
        .set({
          persona: persona,
          institucionEducativaSucursal: institucionEducativaSucursal,
          formacionTipo: formacionTipo,
          financiamientoTipo: financiamientoTipo,
          cargoTipo: cargoTipo,
          especialidadTipo: especialidadTipo,
          gestionTipo: gestionTipo,
          normalista: dto.normalista,
          formacionDescripcion: dto.formacionDescripcion,
          braile: dto.braile,
          estudioIdiomaTipo: idiomaTipo,
          asignacionFechaInicio: dto.asignacionFechaInicio,
          asignacionFechaFin: dto.asignacionFechaFin,
          item: dto.item,
          maestroInscripcionIdAm: dto.maestroInscripcionIdAm,
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
    console.log("idiomaTipo : ", idiomaTipo);
    if (!idiomaTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.estudioIdiomaTipoId,
        "idiomaTipo No Encontrada !!",
        ""
      );
    }

    try {
      console.log(dto);
      console.log("------fin----------");

      const res = await this.maestroRepository
        .createQueryBuilder()
        .update(MaestroInscripcion)
        .set({
          formacionTipo: formacionTipo,
          financiamientoTipo: financiamientoTipo,
          cargoTipo: cargoTipo,
          // especialidadTipo: especialidadTipo,
          normalista: dto.normalista,
          formacionDescripcion: dto.formacionDescripcion,
          braile: dto.braile,
          estudioIdiomaTipo: idiomaTipo,
          asignacionFechaInicio: dto.asignacionFechaInicio,
          asignacionFechaFin: dto.asignacionFechaFin,
          item: dto.item,
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
}
