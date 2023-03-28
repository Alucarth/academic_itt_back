
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
@ApiTags('maestro-inscripcion')
@Controller('maestro-inscripcion')
export class MaestroInscripcionController {

    constructor(private readonly usersService: MaestroInscripcionService) {}

    
  @Get('/getAllDocentesByUeGestion/:ueId/:gestionId')
  getAllDocentesByUeGestion(@Param('ueId') ueId:string, @Param('gestionId') gestionId:string ){
    return this.usersService.getAllDocentesByUeGestion(ueId);
  }

}
