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
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

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
  @Auth()
  @Post("/")
  async addMaestroInscripciom(
    @Body() body: CreateMaestroInscripcionDto,
    @Users() user: UserEntity

  ) {
    //console.log("POST addMaestroInscripciom", body);
    return await this.usersService.createUpdateMaestroInscripcion(body, user);
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

  @Get("/getDataDocentesByUeGestion/:ueId/:gestionId/:periodoId")
  getDataDocentesByUeGestion(
    @Param("ueId") ueId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number
  ) {
    return this.usersService.getDataDocentesByUeGestion(
      ueId,
      gestionId,
      periodoId
    );
  }

  @Get("/getDataAdministrativosByUeGestion/:ueId/:gestionId/:periodoId")
  getDataAdministrativosByUeGestion(
    @Param("ueId") ueId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number
  ) {
    return this.usersService.getDataAdministrativosByUeGestion(
      ueId,
      gestionId,
      periodoId
    );
  }

  //solo maestros por carrera autorizada
  @Get("/xlsAllDocentesByCarreraAutorizada/:id/:ueId")
  @Header("Content-Type", "text/xlsx")
    async getXlsAllDocentesByCarreraAutorizada(
      @Param("id") id: number,  
      @Param("ueId") ueId: number,    
      @Res() res: Response
    ) {
    let result = await this.usersService.getXlsAllDocentesByCarreraAutorizada(id,ueId);
    res.download(`${result}`);
  }

  @Get('crear-usuarios-estudiantes')
  async createUsuariosEstudiantes(){
      console.log("total docentes por departamento y dependencia");
      //return await this.usersService.crearUsuariosEstudiantes();
  }
  
  @Get('/teacher-detail/:carnet_identidad/:codigo_rit')
  async getTeacherDetail(
    @Param("carnet_identidad") carnet_identidad: number,  
    @Param("codigo_rit") codigo_rit: number,
  ) {
    return await this.usersService.getTeacherDetail(carnet_identidad, codigo_rit)
    
  }

}
