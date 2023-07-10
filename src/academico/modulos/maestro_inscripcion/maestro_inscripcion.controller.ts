import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Delete,
  Req,
  Header,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from "express";
import { Res } from "@nestjs/common";

import { MaestroInscripcionService } from '../maestro_inscripcion/maestro_inscripcion.service';
import { CreateMaestroInscripcionDto } from './dto/createMaestroInscripcion.dto';
import { UpdateMaestroInscripcionDto } from './dto/updateMaestroInscripcion.dto';
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";

@ApiTags("maestro-inscripcion")
@Controller("maestro-inscripcion")
export class MaestroInscripcionController {
  constructor(private readonly usersService: MaestroInscripcionService) {}

  @Get("/getAllDocentesByUeGestion/:ueId/:gestionId/:periodoId")
  getAllDocentesByUeGestion(
    @Param("ueId") ueId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number
  ) {
    return this.usersService.getAllDocentesByUeGestion(
      ueId,
      gestionId,
      periodoId
    );
  }

  @Get(
    "/getAllDocentesByUeGestionPeriodo/:personaId/:gestionId/:periodoId/:ueId"
  )
  getAllDocentesByUeGestionDocente(
    @Param("personaId") personaId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number,
    @Param("ueId") ueId: number
  ) {
    return this.usersService.getMaestroInscripcionByPersonaGestionPeriodo(
      personaId,
      gestionId,
      periodoId,
      ueId
    );
  }

  @Get("/getMaestroInscripcionById/:maestroInscripcionId")
  getMaestroInscripcionById(
    @Param("maestroInscripcionId") maestroInscripcionId: string
  ) {
    return this.usersService.getMaestroInscripcionById(
      parseInt(maestroInscripcionId)
    );
  }

  @Get("/getAllDocentesByUeGestionPeriodo/:ueId/:gestionId/:periodoId")
  getListaDocentesByUeGestion(
    @Param("ueId") ueId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number
  ) {
    return this.usersService.getAllDocentesByUeGestionPeriodo(
      ueId,
      gestionId,
      periodoId
    );
  }

  @Get("/getAllDirectivosByUeGestion/:ueId/:gestionId")
  getAllDirectivosByUeGestion(
    @Param("ueId") ueId: string,
    @Param("gestionId") gestionId: string
  ) {
    return this.usersService.getAllDirectivosByUeGestion(ueId);
  }

  @Get("/getAllAdministrativosByUeGestion/:ueId/:gestionId")
  getAllAdministrativosByUeGestion(
    @Param("ueId") ueId: string,
    @Param("gestionId") gestionId: string
  ) {
    return this.usersService.getAllAdministrativosByUeGestion(ueId);
  }

  //@UseGuards(JwtAuthGuard)
  @Post("/")
  async addMaestroInscripciom(
    @Body() body: CreateMaestroInscripcionDto,
    @Req() request: Request
  ) {
    //console.log("POST addMaestroInscripciom", body);

    return await this.usersService.createUpdateMaestroInscripcion(body, request);
  }

  @Put("/")
  async UpdateMaestroInscripcion(@Body() body: UpdateMaestroInscripcionDto) {
    console.log("controller edit", body);
    return await this.usersService.updateMaestroInscripcion(body);
  }

  @Put("/changeStatusById")
  async changeStatusById(@Body() body) {
    //TODO: validara body, un dto ??
    console.log("maestroInscripcionId", body.maestroInscripcionId);
    return await this.usersService.changeStatusById(body);
  }

  @Get('reporte/totales')
    async getTotaldocentes(){
        console.log("total docentes");
        return await this.usersService.getTotalDocentes();
  }
  @Get('reporte/dependencias')
  async getTotalEstudiantesDependencia(){
      console.log("total docentes por departamento y dependencia");
      return await this.usersService.findListaDocentesRegimenDepartamento();
  }
  @Get('reporte/carreras-financiamientos/:lugar/:dependencia')
    async getListaDocentesFinancimiento(@Param("lugar", ParseIntPipe) lugar: number, @Param("dependencia", ParseIntPipe) dependencia: number){
        console.log("lista carreras, financiamientos de docentes");
        return await this.usersService.findListaDocentesFinanciamiento(lugar, dependencia);
  }

  @Get("/xlsAllDocentesByUeGestion/:ueId/:gestionId/:periodoId")
  @Header("Content-Type", "text/xlsx")
    async getXlsAllDocentesByUeGestion(
      @Param("ueId") ueId: number,
      @Param("gestionId") gestionId: number,
      @Param("periodoId") periodoId: number,
      @Res() res: Response
    ) {
    let result = await this.usersService.getXlsAllDocentesByUeGestion(ueId,
      gestionId,
      periodoId);
    res.download(`${result}`);
  }

  //solo administrativos
  @Get("/xlsAllAdministrativosByUeGestion/:ueId/:gestionId/:periodoId")
  @Header("Content-Type", "text/xlsx")
    async getXlsAllAdministrativosByUeGestion(
      @Param("ueId") ueId: number,
      @Param("gestionId") gestionId: number,
      @Param("periodoId") periodoId: number,
      @Res() res: Response
    ) {
    let result = await this.usersService.getXlsAllAdministrativosByUeGestion(ueId,
      gestionId,
      periodoId);
    res.download(`${result}`);
  }
  

}
