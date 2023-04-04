import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EtapaEducativaTipo } from 'src/academico/entidades/etapaEducativaTipo.entity';
import { EducacionTipo } from 'src/academico/entidades/educacionTipo.entity';
import { EntityManager, Repository } from 'typeorm';
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { CreateEtapaEducativaDto } from './dto/createEtapaEducativa.dto';

@Injectable()
export class EtapaEducativaService {
  constructor(
    @InjectRepository(EtapaEducativa)
    private etapaEducativaRepository: Repository<EtapaEducativa>,
    @InjectRepository(EtapaEducativaTipo)
    private etapaEducativaTipoRepository: Repository<EtapaEducativaTipo>,
    @InjectRepository(EducacionTipo)
    private educacionTipoRepository: Repository<EducacionTipo>,
    private _serviceResp: RespuestaSigedService
  ) {}
  async getById(id: number) {
    const etapa = await this.etapaEducativaRepository.findOneBy({ id: id });
    return etapa;
  }
  async findAllRecursiveHijos(id: number) {
    const sql =
      "WITH RECURSIVE etapa AS (\n" +
      "    SELECT\n" +
      "        e0.id,\n" +
      "        e0.etapa_educativa_id,\n" +
      "        e0.etapa_educativa,\n" +
      "        e0.activo,\n" +
      "        e0.etapa_educativa_tipo_id,\n" +
      "        t0.etapa_educativa as etapa_educativa_tipo\n" +
      "    FROM\n" +
      "        etapa_educativa e0, etapa_educativa_tipo t0\n" +
      "    WHERE\n" +
      "        e0.id = $1 and e0.activo = true and e0.etapa_educativa_tipo_id=t0.id\n" +
      "    UNION\n" +
      "        SELECT\n" +
      "            e.id,\n" +
      "            e.etapa_educativa_id,\n" +
      "            e.etapa_educativa,\n" +
      "            e.activo,\n" +
      "            e.etapa_educativa_tipo_id,\n" +
      "            t.etapa_educativa as estapa_educativa_tipo\n" +
      "        FROM\n" +
      "            etapa_educativa e\n" +
      "        INNER JOIN etapa_educativa_tipo t ON t.id = e.etapa_educativa_tipo_id\n" +
      "        INNER JOIN etapa s ON s.id = e.etapa_educativa_id\n" +
      ") SELECT\n" +
      "    *\n" +
      "FROM\n" +
      "    etapa where id<>$1;\n";
    const values = [id];
    const data = this.etapaEducativaRepository.query(sql, values);
    console.log(data);
    return data;
  }

  async findAllRecursivePadres(id: number) {
    const sql =
      "WITH RECURSIVE buscandoPadre AS (\n" +
      "    SELECT\n" +
      "        e0.id,\n" +
      "        e0.etapa_educativa_id,\n" +
      "        e0.etapa_educativa,\n" +
      "        e0.activo,\n" +
      "        e0.etapa_educativa_tipo_id,\n" +
      "        t0.etapa_educativa as etapa_educativa_tipo\n" +
      "    FROM\n" +
      "        etapa_educativa e0,\n" +
      "        etapa_educativa_tipo t0\n" +
      "    WHERE\n" +
      "        e0.id = $1 and e0.activo = true and t0.id = e0.etapa_educativa_tipo_id \n" +
      "        UNION\n" +
      "        SELECT\n" +
      "            e.id,\n" +
      "            e.etapa_educativa_id,\n" +
      "            e.etapa_educativa,\n" +
      "            e.activo,\n" +
      "            e.etapa_educativa_tipo_id,\n" +
      "            t.etapa_educativa as etapa_educativa_tipo\n" +
      "        FROM\n" +
      "            etapa_educativa e \n" +
      "        INNER JOIN etapa_educativa_tipo t ON t.id = e.etapa_educativa_tipo_id\n" +
      "        INNER JOIN buscandoPadre s ON e.id = s.etapa_educativa_id\n" +
      "        \n" +
      ") SELECT\n" +
      "    *\n" +
      "FROM\n" +
      "    buscandoPadre where id>0 order by id desc ";
    const values = [id];
    const data = await this.etapaEducativaRepository.query(sql, values);
    console.log(data);
    return data;
  }

  async findCarrerasBySie(id: number) {
    const values = [
      "etapa_educativa_tipo",
      25,
      28,
      id,
      "etapa_educativa",
      "codigo",
      "etapa_educativa",
      "etapa_educativa_tipo_id",
    ];
    const sql =
      "select * from sp_genera_acreditacion_oferta_json($1,$2,$3,$4,$5,$6,$7,$8)";
    const data = await this.etapaEducativaRepository.query(sql, values);
    console.log(data);
    //return data;

    return this._serviceResp.respuestaHttp201(data, "Datos Encontrados !!", "");
  }

  async findAsignaturasRegimenCarrera(id: number) {
    const asignaturas = await this.etapaEducativaRepository
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.etapasEducativasAsignaturas", "b")
      .innerJoinAndSelect("b.asignaturaTipo", "c")
      .where("a.etapaEducativaId = :id ", { id })
      .orderBy("a.id", "ASC")
      .getMany();
    //return asignaturas;

    return this._serviceResp.respuestaHttp201(
      asignaturas,
      "Datos Encontrados !!",
      ""
    );
  }

  async findAllNivelAcademico() {
    const asignaturas = await this.etapaEducativaRepository.query(`SELECT
      id, etapa_educativa, etapa_educativa_tipo_id
    FROM
      etapa_educativa     
    WHERE
      activo = true and etapa_educativa_tipo_id = 25 `);

    return this._serviceResp.respuestaHttp201(
      asignaturas,
      "Datos Encontrados !!",
      ""
    );
  }

  async findClasificadorByTipoId(nivelId: number, regimenId: number) {
    if (regimenId === 0) {
      const asignaturas = await this.etapaEducativaRepository.query(`SELECT
        id, etapa_educativa, etapa_educativa_tipo_id
        FROM
          etapa_educativa     
        WHERE
          activo = true and etapa_educativa_tipo_id = '${nivelId}' `);

      return this._serviceResp.respuestaHttp201(
        asignaturas,
        "Datos Encontrados !!",
        ""
      );
    } else {
      console.log("here");
      const asignaturas = await this.etapaEducativaRepository.query(`SELECT
        id, etapa_educativa, etapa_educativa_tipo_id
        FROM
          etapa_educativa     
        WHERE
          activo = true and etapa_educativa_tipo_id = ${nivelId} and etapa_educativa_id = ${regimenId} `);

      return this._serviceResp.respuestaHttp201(
        asignaturas,
        "Datos Encontrados !!",
        ""
      );
    }
  }

  async createNewEtapaEducativa(dto: CreateEtapaEducativaDto) {
    /*
    {	
    "etapaEducativaTipoId": 28,
    "etapa_educativa": "electronica avanzada",
    "etapaEducativaId" : 1471,
    "ordinal" : 0,
    "educacionTipoId": 0,
    "usuarioId": 100,
    "codigo27" : 1471,  area de formacion
    "codigo26" : 1459,  nivel
    "codigo25" : 1455   regimen
  } 
  */

    if (dto.etapaEducativaTipoId < 25 || dto.etapaEducativaTipoId > 29) {
      return this._serviceResp.respuestaHttp404(
        dto.etapaEducativaTipoId,
        "etapaEducativaTipoId no encontrado!!",
        ""
      );
    }

    const etapaEducativaTipo = await this.etapaEducativaTipoRepository.findOne({
      where: { id: dto.etapaEducativaTipoId },
    });
    console.log("etapaEducativaTipo: ", etapaEducativaTipo);

    const educacionTipo = await this.educacionTipoRepository.findOne({
      where: { id: dto.educacionTipoId },
    });
    console.log("educacionTipo: ", educacionTipo);
    if (!educacionTipo) {
      return this._serviceResp.respuestaHttp404(
        dto.educacionTipoId,
        "educacionTipo no encontrado!!",
        ""
      );
    }

    /** validamos 27 area de formacion, 26 regimen  y 25 nivel */
    const etapaEducativa = await this.etapaEducativaRepository.findOne({
      where: { id: dto.codigo27 },
    });
    console.log("etapaEducativa: ", etapaEducativa);
    if (!etapaEducativa) {
      return this._serviceResp.respuestaHttp404(
        dto.codigo27,
        "etapaEducativa Area de Formacion no encontrado!!",
        ""
      );
    }

    let regimentxt = ''
    let veces = 0
    
    const etapaEducativa26 = await this.etapaEducativaRepository.findOne({
      where: { id: dto.codigo26 },
    });
    console.log("etapaEducativa26: ", etapaEducativa26);
    if (!etapaEducativa26) {
      return this._serviceResp.respuestaHttp404(
        dto.codigo26,
        "regimen de estudios no encontrado!!",
        ""
      );
    }else{
      regimentxt = etapaEducativa26.etapaEducativa
      if(regimentxt === 'ANUAL'){
        veces = 3
        regimentxt = " AÑO"
      }else{
        veces = 6
        regimentxt = " SEMESTRE"
      }
    }

    const etapaEducativa25 = await this.etapaEducativaRepository.findOne({
      where: { id: dto.codigo25 },
    });
    console.log("etapaEducativa25: ", etapaEducativa25);
    if (!etapaEducativa25) {
      return this._serviceResp.respuestaHttp404(
        dto.codigo25,
        "nivel academico no encontrado!!",
        ""
      );
    }

    /* la duracion para los 3 o 6 inserts*/
    const etapaEducativaTipo29 = await this.etapaEducativaTipoRepository.findOne({
      where: { id: 29 },
    });
    console.log("etapaEducativaTipo29: ", etapaEducativaTipo29);

    try {
      const result = await this.etapaEducativaRepository
        .createQueryBuilder()
        .insert()
        .into(EtapaEducativa)
        .values([
          {
            etapaEducativaTipo: etapaEducativaTipo,
            etapaEducativa: dto.etapaEducativa,
            activo: true,
            ordinal: 0,
            educacionTipo: educacionTipo,
            etapaEducativaId: etapaEducativa,
          },
        ])
        .returning("id")
        .execute();

      let nuevaCarreraId = result.identifiers[0].id;
      console.log("nueva carrera id: ", result.identifiers[0].id);

      const newEtapaEducativa = await this.etapaEducativaRepository.findOne({
        where: { id: result.identifiers[0].id },
      });
      console.log("newEtapaEducativa: ", newEtapaEducativa);
      if (!newEtapaEducativa) {
        return this._serviceResp.respuestaHttp404(
          result.identifiers[0].id,
          "New etapaEducativa  no encontrado!!",
          ""
        );
      }

      // CREAR LOS SEMESTRES O AÑOS SEGUN EL REGIMEN

      for(let i=1; i<= veces; i++ ){
        console.log(i, i + regimentxt);

        const result = await this.etapaEducativaRepository
          .createQueryBuilder()
          .insert()
          .into(EtapaEducativa)
          .values([
            {
              etapaEducativaTipo: etapaEducativaTipo29,
              etapaEducativa: i + "° " + regimentxt,
              activo: true,
              ordinal: 0,
              educacionTipo: educacionTipo,
              etapaEducativaId: newEtapaEducativa,
            },
          ])
          .returning("id")
          .execute();
      }

      return this._serviceResp.respuestaHttp201(
        nuevaCarreraId,
        "Registro Creado !!",
        ""
      );


    } catch (error) {
      console.log("Error insertar nueva etapa educativa: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar nueva etapa educativa: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async getAsignaturasLike(body) {
    let buscado = body.buscado
    const asignaturas = await this.etapaEducativaRepository.query(`
      SELECT * from asignatura_tipo where asignatura like '%${buscado}%'
      `);

    return this._serviceResp.respuestaHttp201(
      asignaturas,
      "Datos Encontrados !!",
      ""
    );
  }
}
