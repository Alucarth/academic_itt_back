import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Auth } from "src/auth/decorator/auth.decorator";
import { User } from "src/users/entity/users.entity";
import { Users } from "src/users/decorator/user.decorator";
import { MatriculaEstudianteService } from "./matricula_estudiante.service";
import { createReadStream } from "fs";
import { fileName } from "src/common/helpers/file.utils";
import { join } from "path";

@ApiTags("Matricula Estudiante")
@Controller("matricula-estudiante")
export class MatriculaEstudianteController {
  constructor(
    private readonly matriculaEstudianteService: MatriculaEstudianteService
  ) {}

  @Get("list/:estado_instituto_id/:departamento_id")
  async getList(
    @Param("estado_instituto_id") estado_instituto_id: number,
    @Param("departamento_id") departamento_id: number
  ) {
    return await this.matriculaEstudianteService.getList(
      estado_instituto_id,
      departamento_id
    );
  }

  @Get(":matricula_estudiante_id")
  async getMatriculaEstudiante(
    @Param("matricula_estudiante_id") matricula_estudiante_id: number
  ) {
    return await this.matriculaEstudianteService.getMatriculaEstudiante(
      matricula_estudiante_id
    );
  }

  @Auth()
  @Post("send-dde")
  async sendDDE(@Body() payload: any, @Users() user: User) {
    console.log("payload -------->", payload);
    return await this.matriculaEstudianteService.sendDDE(
      payload.matricula_estudiante_id,
      payload.files,
      user
    );
  }

  @Get("file/:file_name")
  getFile(@Param("file_name") file_name: string): StreamableFile {
    console.log("file_name", file_name);
    const file = createReadStream(join(process.cwd(), "uploads/" + file_name));
    return new StreamableFile(file);
  }

  @Auth()
  @Post("upadte-state-matricula-estudiante")
  async upadteStateMatriculaEstudiante(@Body() payload: any, @Users() user: User) {
    console.log("payload  update state --->", payload);
    return await this.matriculaEstudianteService.updateState(payload.matricula_estudiante_id, payload.estado_instituto_id, payload.observacion, user.id);
  }
//   matricula_estudiante_id:number, estado_instituto_id: number, observacion: string, user_id: number
}
