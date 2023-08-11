import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AreaTipo } from "src/academico/entidades/areaTipo.entity";
import { In, Repository } from "typeorm";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { JwtService } from "@nestjs/jwt";
import { User as UserEntity } from 'src/users/entity/users.entity';

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

  async insertRecord(body, user:UserEntity) {
    //0: validar token
    try {
      const newRecord = await this.areaTipoRepository
        .createQueryBuilder()
        .insert()
        .into(AreaTipo)
        .values([
          {
            area: body.areaFormacion,
            usuarioId: user.id,
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
          area: body.area,
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
