import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotFoundException, HttpException } from "@nestjs/common";
import { User } from "src/users/entity/users.entity";
import { Repository } from "typeorm";
import { RespuestaSigedService } from "../../../shared/respuesta.service";

@Injectable()
export class MallaCurricularService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private _serviceResp: RespuestaSigedService
  ) {}

  async getAllCarrerasByInstitutoId(InstitutoId: number) {
    const result = await this.userRepository.query(`SELECT
      usuario."id", 
      usuario_rol.id as usuario_rol_id,
      usuario_rol.rol_tipo_id, 
      rol_tipo."id", 
      rol_tipo.rol, 
      rol_tipo.activo
    FROM
      usuario
      INNER JOIN
      usuario_rol
      ON 
        usuario."id" = usuario_rol.usuario_id
      INNER JOIN
      rol_tipo
      ON 
        usuario_rol.rol_tipo_id = rol_tipo."id"
        where usuario.id = ${InstitutoId}`);

    console.log("result: ", result);
    console.log("result size: ", result.length);

    if (result.length === 0) {

        return this._serviceResp.respuestaHttp404(
          InstitutoId,
          "Registro No Encontrado !!",
          ""
        );
     
    }

    return this._serviceResp.respuestaHttp201(
      result,
      "",
      "Registro Encontrado !!"
    );

    
  }
}
