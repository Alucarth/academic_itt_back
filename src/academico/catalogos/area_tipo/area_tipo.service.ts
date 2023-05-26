import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AreaTipo } from "src/academico/entidades/areaTipo.entity";
import { In, Repository } from "typeorm";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AreaTipoService {
  constructor(
    private _serviceResp: RespuestaSigedService,
    private jwtService: JwtService,
    @InjectRepository(AreaTipo) private areaTipoRepository: Repository<AreaTipo>
  ) {}

  async getAll() {
    const result = await this.areaTipoRepository.find();
    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }
  async getListAreasCursos() {
    const result = await this.areaTipoRepository.findBy({
      id: In([1]),
    });
    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }

  async getOneById(id: number) {
    const result = await this.areaTipoRepository.findOne({
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

  async insertRecord(body, request) {
    //0: validar token
    let user_id = 0;
    console.log("updateUser:", request.headers["token"]);
    try {
      const payload = await this.jwtService.decode(request.headers["token"]);
      console.log("payload:", payload["id"]);
      if (!payload) {
        throw new UnauthorizedException();
      }
      user_id = parseInt(payload["id"]) + 0;
    } catch {
      throw new UnauthorizedException();
    }
    console.log("updateUserId:", user_id);

    try {
      const newRecord = await this.areaTipoRepository
        .createQueryBuilder()
        .insert()
        .into(AreaTipo)
        .values([
          {
            area: body.areaFormacion,
            usuarioId: user_id,
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
          error: `Error insertar area_tipo: ${error.message}`,
        },
        HttpStatus.ACCEPTED,
        {
          cause: error,
        }
      );
    }
  }

  async updateRecord(body) {
    try {
      const result = await this.areaTipoRepository
        .createQueryBuilder()
        .update(AreaTipo)
        .set({
          area: body.areaFormacion,
        })
        .where("id = :id", { id: body.id })
        .execute();

      return this._serviceResp.respuestaHttp202(
        result,
        "Registro Actualizado !!",
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

  async deleteRecord(id: number) {
    const result = await this.areaTipoRepository
      .createQueryBuilder()
      .delete()
      .from(AreaTipo)
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
