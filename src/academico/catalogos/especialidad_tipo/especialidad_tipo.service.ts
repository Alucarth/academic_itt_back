import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EspecialidadTipo } from "src/academico/entidades/especialidadTipo.entity";
import { Repository } from "typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { RespuestaSigedService } from "../../../shared/respuesta.service";

@Injectable()
export class EspecialidadTipoService {
  constructor(
    @InjectRepository(EspecialidadTipo)
    private especialidadTipoRepository: Repository<EspecialidadTipo>,
    private _serviceResp: RespuestaSigedService
  ) {}
  async getAll() {
    //return await this.especialidadTipoRepository.find();
    const result = await this.especialidadTipoRepository.find();
    return this._serviceResp.respuestaHttp200(
      result,
      "",
      "Registro Encontrado !!"
    );
  }
}
