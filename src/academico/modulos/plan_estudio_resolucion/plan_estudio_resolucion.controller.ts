import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { CreateResolucionDto } from './dto/createResolucion.dto';
import { PlanEstudioResolucionService } from './plan_estudio_resolucion.service';

@Controller('plan-estudio-resolucion')
export class PlanEstudioResolucionController {
    constructor(
        private readonly planEstudioResolucionService: PlanEstudioResolucionService
    ){}

    @Get()
    async getResoluciones(){
       return await this.planEstudioResolucionService.getOnlyResoluciones();
    }
    @Get('detalle')
    async getPlanesResoluciones(){
       return await this.planEstudioResolucionService.getResolucionesAll();
    }

    @Post()
    async addPlanCarreraAutorizada(@Body() dto: CreatePlanEstudioResolucionDto) {
      console.log("-*************-");
      return await this.planEstudioResolucionService.crear(dto);
    }
    @Post('resolucion')
    async addResolucion(@Body() dto: CreateResolucionDto) {
      console.log("-*************- RESOLUCION");
      return await this.planEstudioResolucionService.createNewResolucion(dto);
    }

}
