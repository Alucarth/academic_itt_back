import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InscripcionService } from "./inscripcion.service";
import { CreateInscriptionDto } from "./dto/createInscription.dto";
import { CreateMatriculaDto } from "./dto/createMatricula.dto";
import { CreateInscriptionNuevoDto } from "./dto/createInscriptionNuevo.dto";

@ApiTags("Matriculacion e Inscripcion")
@Controller("inscripcion")
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @ApiOperation({
    summary: "Crea Inscripcion",
  })
  @Post("/nuevo")
  async createInscription(@Body() dto: CreateInscriptionNuevoDto[]) {
    const res = await this.inscripcionService.createInscriptionNuevo(dto);
    return res;
  }

  @ApiOperation({
    summary: "Crea Matricula",
  })
  @Post("/matricula")
  async create(@Body() dto: CreateMatriculaDto) {
    const res = await this.inscripcionService.createMatricula(dto);
    return res;
  }

  @ApiOperation({
    summary: "Crea Matriculas en Lote",
  })
  @Post("/matriculaLote")
  async createMatriculaLote(@Body() dtos: CreateMatriculaDto[]) {
    const res = await this.inscripcionService.createMatriculaLote(dtos);
    return res;
  }

  @ApiOperation({
    summary:
      "Devuelve todos los matriculados en una gestion, periodo, carrera e institucion educativa",
  })
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

  @ApiOperation({
    summary:
      "Devuelve todos los inscritos en una gestion, periodo, carrera e institucion educativa",
  })
  @Get("/listado/:gestionId/:periodoId/:carreraId/:ieId")
  async getAllInscritosByGestion(
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string
  ) {
    return await this.inscripcionService.getAllInscritosByGestion(
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId)
    );
  }

  @ApiOperation({
    summary:
      "Devuelve todos las materias de una persona inscrita en una gestion, periodo, carrera e institucion educativa",
  })
  @Get("/detalleByPersonaId/:personaId/:gestionId/:periodoId/:carreraId/:ieId")
  async getAllDetalleInscripcionPersona(
    @Param("personaId") personaId: string,
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string
  ) {
    return await this.inscripcionService.getAllDetalleInscripcionPersona(
      parseInt(personaId),
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId)
    );
  }

  @ApiOperation({
    summary: "Devuelve todos las materias del primer trimestre",
  })
  @Get("/materiasNuevoByCarreraAutorizadaId/:carreraAutorizadaId")
  async getMateriasNuevoByCarreraId(
    @Param("carreraAutorizadaId") carreraAutorizadaId: string
  ) {
    return await this.inscripcionService.getAllMateriasInscripcionNuevo(
      parseInt(carreraAutorizadaId)
    );
  }

  @ApiOperation({
    summary: "Devuelve personas sin matricula",
  })
  @Get("/personasSinMatricula/:carreraAutorizadaId")
  async getPersonasSinMatricula(
    @Param("carreraAutorizadaId") carreraAutorizadaId: string
  ) {
    return await this.inscripcionService.getPersonasSinMatricula(
      parseInt(carreraAutorizadaId)
    );
  }
}
