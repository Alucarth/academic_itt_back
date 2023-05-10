import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";
import { AsignaturaTipo} from "../../entidades/asignaturaTipo.entity"
import { skip, take } from "rxjs";

@Injectable()
export class AsignaturaTipoService {
  constructor(
    @InjectRepository(AsignaturaTipo)
    private asignaturaTipoRepository: Repository<AsignaturaTipo>,
    private _serviceResp: RespuestaSigedService
  ) {}

  async getAsignaturasAll(){
    //var result: EspecialidadTipo[] = [];
    const result =  await this.asignaturaTipoRepository.find({order: {
        id: 'DESC'
        },
        skip: 0,
        take: 20})

    return this._serviceResp.respuestaHttp201(
    result,
    'Registro Encontrado !!',
    '',
    );

}
  async create(dto: CreateAsignaturaTipoDto) {
    
    //TODO: en la tabla actual el campo asignatura_id todo esta con CERO

    //existe el area tipo = 0 ?
    const asignaturaTipoCero = await this.asignaturaTipoRepository.findOne({
      where: { id: 0 },
    });
    console.log("persona:", asignaturaTipoCero);

    if (!asignaturaTipoCero) {
      return this._serviceResp.respuestaHttp404(
        0,
        "AsignaturaTipoId no encontrada!",
        ""
      );
    }

    try {

        const res = await this.asignaturaTipoRepository
          .createQueryBuilder()
          .insert()
          .into(AsignaturaTipo)
          .values([
            {
              asignatura: dto.asignatura,
              abreviacion: dto.abreviacion,
              comentario: dto.comentario,
              asignaturaId: asignaturaTipoCero,
            },
          ])
          .execute();

        console.log("res:", res);
        console.log("asignaturatipo adicionado");
        return this._serviceResp.respuestaHttp201(
          res.identifiers[0].id,
          "Registro Creado !!",
          ""
        );
        
    } catch (error) {

        console.log("Error insertar asignaturatipo: ", error);
        throw new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error: `Error insertar asignaturatipo: ${error.message}`,
          },
          HttpStatus.ACCEPTED,
          {
            cause: error,
          }
        );
        
    }


  }
}
