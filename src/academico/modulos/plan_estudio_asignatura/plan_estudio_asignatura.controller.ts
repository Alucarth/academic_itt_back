import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { PlanEstudioAsignaturaService } from './plan_estudio_asignatura.service';

@Controller('plan-estudio-asignatura')
export class PlanEstudioAsignaturaController {
    constructor(
        private readonly planEstudioAsignaturaService: PlanEstudioAsignaturaService
    ){}

    @Get()
    async getPlanesAsignaturas(){
       return await this.planEstudioAsignaturaService.getAll();
    }

    @Post()
    async addOfertaAcademicaMaestroInscripcion(@Body() dto: CreatePlanEstudioAsignaturaDto[]) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignatura(dto);
    }
}
