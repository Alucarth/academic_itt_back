import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { PlanEstudioResolucionService } from './plan_estudio_resolucion.service';

@Controller('plan-estudio-resolucion')
export class PlanEstudioResolucionController {
    constructor(
        private readonly planEstudioResolucionService: PlanEstudioResolucionService
    ){}

    @Get()
    async getPlanesResoluciones(){
       return await this.planEstudioResolucionService.getResolucionesAll();
    }

    @Post()
    async addOfertaAcademicaMaestroInscripcion(@Body() dto: CreatePlanEstudioResolucionDto) {
      console.log("-*************-");
      return await this.planEstudioResolucionService.crear(dto);
    }

}
