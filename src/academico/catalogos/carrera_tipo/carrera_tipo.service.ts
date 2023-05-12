import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { Repository } from "typeorm";
import { DataSource, EntityManager } from "typeorm";

import { CarreraTipo } from "src/academico/entidades/carrerraTipo.entity";
import { CarreraGrupoTipo } from "src/academico/entidades/carreraGrupoTipo.entity";

@Injectable()
export class CarreraTipoService {
  constructor(
    private _serviceResp: RespuestaSigedService,
    private dataSource: DataSource,
    @InjectRepository(CarreraTipo)
    private carreraTipoRepository: Repository<CarreraTipo>,
    @InjectRepository(CarreraGrupoTipo)
    private carreraGrupoRepository: Repository<CarreraGrupoTipo>
  ) {}

  async getAll() {
    //const result = await this.carreraTipoRepository.find();

    const result = await this.dataSource
      .getRepository(CarreraTipo)
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.carreraGrupoTipo", "d")
      .select([
        "a.id",
        "a.carrera",
        "a.fechaRegistro",
        "a.fechaModificacion",
        "d.id",
        "d.grupo",
      ])
      .getMany();

    console.log(result);

    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async getAllCarreras() {
    //const result = await this.carreraTipoRepository.find();
   // const solocursoscortos = 2
    const result = await this.dataSource
      .getRepository(CarreraTipo)
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.carreraGrupoTipo", "d")
      .select([
          "a.id",
          "a.carrera",
          "a.fechaRegistro",
          "a.fechaModificacion",
          "d.id",
          "d.grupo",
        ])
      .where('d.id in (1)')
      .getMany();

    console.log(result);

    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }
  async getAllCursosCortos() {
    //const result = await this.carreraTipoRepository.find();
    const solocursoscortos = 2
    const result = await this.dataSource
      .getRepository(CarreraTipo)
      .createQueryBuilder("a")
      .innerJoinAndSelect("a.carreraGrupoTipo", "d")
      .select([
          "a.id",
          "a.carrera",
          "a.fechaRegistro",
          "a.fechaModificacion",
          "d.id",
          "d.grupo",
        ])
      .where('d.id in (2)')
      .getMany();

    console.log(result);

    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async getOneById(id: number) {
    const result = await this.carreraTipoRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!result) {
      return this._serviceResp.respuestaHttp400(
        "",
        "",
        "Registro No Encontrado !!"
      );
    }

    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async insertRecord(body) {
    //TODO:validar si existe carreraGrupo
    const carreraGrupo = await this.carreraGrupoRepository.find({
      where: {
        id: body.carreraGrupoTipoId,
      },
    });
    if (carreraGrupo.length == 0) {
      return this._serviceResp.respuestaHttp404(
        body.carreraGrupoTipoId,
        "CarreraGrupo No Encontrado !!",
        ""
      );
    }

    try {
      const newRecord = await this.carreraTipoRepository
        .createQueryBuilder()
        .insert()
        .into(CarreraTipo)
        .values([
          {
            carrera: body.carrera,
            carreraGrupoTipo: carreraGrupo[0],
          },
        ])
        .returning("id")
        .execute();

      return this._serviceResp.respuestaHttp201(
        newRecord.identifiers[0].id,
        "Registro Creado !!",
        ""
      );
    } catch (error) {
      console.log("Error insertar maestro inscripcion: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar roadmap: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async updateRecord(body) {

    const carreraGrupo = await this.carreraGrupoRepository.find({
      where: {
        id: body.carreraGrupoTipoId,
      },
    });
    if (carreraGrupo.length == 0) {
      return this._serviceResp.respuestaHttp404(
        body.carreraGrupoTipoId,
        "CarreraGrupo No Encontrado !!",
        ""
      );
    }

    try {
      const result = await this.carreraTipoRepository
        .createQueryBuilder()
        .update(CarreraTipo)
        .set({
          carrera: body.carrera,
          carreraGrupoTipo: carreraGrupo[0],
        })
        .where("id = :id", { id: body.id })
        .execute();

      return this._serviceResp.respuestaHttp202(
        result,
        "Registro Actualizado !!",
        ""
      );
    } catch (error) {
      console.log("Error actualizar carrera tipo: ", error);
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: `Error insertar carrera tipo: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async deleteRecord(id: number) {
    const result = await this.carreraTipoRepository
      .createQueryBuilder()
      .delete()
      .from(CarreraTipo)
      .where("id = :id", { id })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException("registro no encontrado !");
    }

    return this._serviceResp.respuestaHttp203(
      result,
      "Registro Eliminado !!",
      ""
    );
  }
}