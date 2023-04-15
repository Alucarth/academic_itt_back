
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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { MaestroInscripcionService } from '../maestro_inscripcion/maestro_inscripcion.service';
import { CreateMaestroInscripcionDto } from './dto/createMaestroInscripcion.dto';
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';
import { UpdateMaestroInscripcionDto } from './dto/updateMaestroInscripcion.dto';
@ApiTags("maestro-inscripcion")
@Controller("maestro-inscripcion")
export class MaestroInscripcionController {
  constructor(private readonly usersService: MaestroInscripcionService) {}

  @Get("/getAllDocentesByUeGestion/:ueId/:gestionId")
  getAllDocentesByUeGestion(
    @Param("ueId") ueId: number,
    @Param("gestionId") gestionId: number
  ) {
    return this.usersService.getAllDocentesByUeGestion(ueId);
  }

  @Get("/getAllDocentesByUeGestionPeriodo/:personaId/:gestionId/:periodoId/:ueId")
  getAllDocentesByUeGestionDocente(
    @Param("personaId") personaId: number,
    @Param("gestionId") gestionId: number,
    @Param("periodoId") periodoId: number,
    @Param("ueId") ueId: number,
  ) {
    return this.usersService.getMaestroInscripcionByPersonaGestionPeriodo(personaId, gestionId, periodoId, ueId);
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
    return this.usersService.getAllDocentesByUeGestionPeriodo(ueId, gestionId, periodoId);
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

  @Post("/")
  async addUser(@Body() body: CreateMaestroInscripcionDto) {
    console.log("controller new", body);
    
    return await this.usersService.createUpdateMaestroInscripcion(body);
  }

  @Post("/oferta-academica")
  async addOfertaAcademica(@Body() dto: CreateOfertaAcademicaMaestroInscripcionDto) {
    console.log("controller new", dto);
    
    return await this.usersService.createOFertaAcademicaMaestroInscripcion(dto);
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

 


}
