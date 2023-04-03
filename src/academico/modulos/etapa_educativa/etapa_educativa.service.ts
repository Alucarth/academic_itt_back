import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EtapaEducativaTipo } from 'src/academico/entidades/etapaEducativaTipo.entity';
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
    "codigo27" : 1471,
    "codigo26" : 1459,
    "codigo25" : 1455    
  } 
  */

    if (dto.etapaEducativaTipoId < 25 && dto.etapaEducativaTipoId > 29) {
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

    try {
      await this.etapaEducativaRepository
        .createQueryBuilder()
        .insert()
        .into(EtapaEducativa)
        .values([
          {
            etapaEducativaTipo: etapaEducativaTipo,
            etapaEducativa: dto.etapaEducativa,
            activo: true,
          },
        ])
        .execute();
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
