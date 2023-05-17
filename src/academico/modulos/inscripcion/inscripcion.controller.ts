import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InscripcionService } from "./inscripcion.service";
import { CreateInscriptionDto } from "./dto/createInscription.dto";
import { CreateMatriculaDto } from "./dto/createMatricula.dto";

@ApiTags("Matriculacion e Inscripcion")
@Controller("inscripcion")
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  async createInscription(@Body() dto: CreateInscriptionDto) {
    const res = await this.inscripcionService.createInscription(dto);
    return res;
  }

  @Post("/matricula")
  async create(@Body() dto: CreateMatriculaDto) {
    const res = await this.inscripcionService.createMatricula(dto);
    return res;
  }

  @Get("/matriculados/:gestionId/:periodoId/:carreraId/:ieId")
  async getAllMatriculadosByGestion(
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string
  ) {
    return await this.inscripcionService.getAllMatriculadosByGestion(
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId)
    );
  }
}
