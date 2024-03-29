import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
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
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

import { Response } from "express";
import { Res } from "@nestjs/common";

@ApiTags("Matriculacion e Inscripcion")
@Controller("inscripcion")
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Auth()
  @ApiOperation({
    summary: "Crea Inscripcion",
  })
  @Post("/nuevo")
  async createInscription(@Body() dto: CreateInscriptionNuevoDto[],  @Users() user: UserEntity) {
    const res = await this.inscripcionService.createInscriptionNuevo(dto, user);
    return res;
  }

  @Auth()
  @ApiOperation({
    summary: "Crea Matricula",
  })
  @Post("/matricula")
  async create(@Body() dto: CreateMatriculaDto,  @Users() user: UserEntity) {
    const res = await this.inscripcionService.createMatricula(dto, user);
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
  
  @Auth()
  @Post("/nuevo-transitabilidad")
  async createInscriptionTransitabilidad(@Body() dto: CreateInscriptionNuevoDto[], @Users() user: UserEntity) {
    const res = await this.inscripcionService.createInscriptionTransitabilidad(dto, user);
    return res;
  }

  @ApiOperation({
    summary:
      "Devuelve todos los matriculados en una gestion, periodo, carrera e institucion educativa",
  })
  /*@Get("/matriculados/:gestionId/:periodoId/:carreraId/:ieId")
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
  }*/

  //se aumenta el instituto_plan_estudio_carrera_id  //convertir parametros de entrada
  @Get("/matriculados/:gestionId/:periodoId/:carreraId/:ieId/:ipecId")
  async getAllMatriculadosByGestion(
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string,
    @Param("ipecId") ipecId: string,
  ) {
    return await this.inscripcionService.getAllMatriculadosByGestion(
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId),
      parseInt(ipecId),
    );
  }

  @Get("/matriculados_homologation/:gestionId/:periodoId/:carreraId/:ieId/:ipecId")
  async getAllMatriculadosByGestionHomologation(
    @Param("gestionId", ParseIntPipe) gestionId: number,
    @Param("periodoId", ParseIntPipe) periodoId: number,
    @Param("carreraId", ParseIntPipe) carreraId: number,
    @Param("ieId", ParseIntPipe) ieId: number,
    @Param("ipecId", ParseIntPipe) ipecId: number,
  ) {
    return await this.inscripcionService.getAllMatriculadosByGestionHomologation(
      gestionId,
      periodoId,
      carreraId,
      ieId,
      ipecId,
    );
  }


  @Get("byAulaId/:id")
  async getAllInscritosByAulaId(
    @Param("id") id: number
  ) {
    return await this.inscripcionService.getAllInscritosByAulaId(id);
  }
  @Get("reprobadosByAulaId/:id")
  async getAllReprobadosByAulaId(
    @Param("id") id: number
  ) {
    return await this.inscripcionService.getAllReprobadosByAulaId(id);
  }
  @Get("reprobados-recuperatorio/ByAulaId/:id/:regimen")
  async getAllReprobadosRecuperatorioByAulaId(
    @Param("id") id: number,
    @Param("regimen") regimen: number
  ) {
    return await this.inscripcionService.getAllReprobadosRecuperatorioByAulaId(id, regimen);
  }

  @Get("calificaciones/aula/:id")
  async getAllInscritosCalificacionByAulaId(
    @Param("id") id: number
  ) {
    return await this.inscripcionService.getAllInscritosCalificacionByAulaId(id);
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
  @Get("/materiasNuevoByCarreraAutorizadaId/:carreraAutorizadaId/:matriculaEstudianteId")
  async getMateriasNuevoByCarreraId(
      @Param("carreraAutorizadaId") carreraAutorizadaId: string,
      @Param("matriculaEstudianteId") matriculaEstudianteId: string

  ) {
      return await this.inscripcionService.getAllMateriasInscripcionNuevo(
        parseInt(carreraAutorizadaId),
        parseInt(matriculaEstudianteId)
      );
  }
  
  @ApiOperation({
    summary: "Devuelve todos las materias por transitabilidad bth",
  })
  @Get("/materiasTransitabilidadByCarreraAutorizadaId/:carreraAutorizadaId/:matriculaEstudianteId")
  async getMateriasTransitabilidadByCarreraId(
    @Param("carreraAutorizadaId") carreraAutorizadaId: string,
    @Param("matriculaEstudianteId") matriculaEstudianteId: string

  ) {
    return await this.inscripcionService.getAllMateriasInscripcionTransitabilidad(
      parseInt(carreraAutorizadaId),
      parseInt(matriculaEstudianteId)
    );
  }

  @ApiOperation({
    summary: "Devuelve todos las materias alumnos antiguos",
  })
  @Get("/materiasAntiguoByCarreraAutorizadaId/:carreraAutorizadaId/:matriculaEstudianteId")
  async getMateriasAntiguoByCarreraId(
    @Param("carreraAutorizadaId") carreraAutorizadaId: string,
    @Param("matriculaEstudianteId") matriculaEstudianteId: string

  ) {
    return await this.inscripcionService.getAllMateriasInscripcionAntiguo(
      parseInt(carreraAutorizadaId),
      parseInt(matriculaEstudianteId)
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

  @ApiOperation({
    summary: "Devuelve las carreras que tengan resoluciones",
  })
  @Get("/carreras-autorizadas/ie/:ieSucursalId")
  async getCarrerasAutizadas(
    @Param("ieSucursalId") ieSucursalId: string
  ) {
    return await this.inscripcionService.getCarrerasAutorizadas(
      parseInt(ieSucursalId)
    );
  }

  @Get('reporte/totales')
    async getTotalEstudiantes(){
        console.log("total estudiantes");
        return await this.inscripcionService.getTotalEstudiantes();
  }
  @Get('reporte/dependencias')
    async getTotalEstudiantesDependencia(){
        console.log("total estudiantes por dependencia");
        return await this.inscripcionService.getTotalEstudiantesDependencia();
  }

  @Get("/xlsMatriculados/:gestionId/:periodoId/:carreraId/:ieId/:ipecId")
  @Header("Content-Type", "text/xlsx")
  async getXlsAllMatriculadosByGestion(
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string,
    @Param("ipecId") ipecId: string,
    @Res() res: Response
  ) {
    let result = await  this.inscripcionService.getXlsAllMatriculadosByGestion(
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId),
      parseInt(ipecId),
    );
    res.download(`${result}`);
  }

  @Get("/xlsInscritos/:gestionId/:periodoId/:carreraId/:ieId/:ipecId")
  @Header("Content-Type", "text/xlsx")
  async getXlsAllInscritosByGestion(
    @Param("gestionId") gestionId: string,
    @Param("periodoId") periodoId: string,
    @Param("carreraId") carreraId: string,
    @Param("ieId") ieId: string,
    @Param("ipecId") ipecId: string,
    @Res() res: Response
  ) {
    let result = await  this.inscripcionService.getXlsAllInscritosByGestion(
      parseInt(gestionId),
      parseInt(periodoId),
      parseInt(carreraId),
      parseInt(ieId),
      parseInt(ipecId),
    );
    res.download(`${result}`);
  }
  @Put('cambia-estado/:id')
  async updateEstadoNoSePresento( @Param('id') id: number) {
      return  await this.inscripcionService.updateEstadoNoSePresento(id);        
  }

  @Delete(":id")
  async deleteInscripcionByMatriculaId(
    @Param("id") id: number,
  ) {
    return await this.inscripcionService.deleteInscripcionMatriculado(id);
  }
  @Delete("matricula/:id")
  async deleteMatriculadoId(
    @Param("id") id: number,
  ) {
    return await this.inscripcionService.deleteMatriculado(id);
  }

}
