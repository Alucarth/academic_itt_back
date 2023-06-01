import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { CreatePlanAsignaturaPrerequisitoDto } from './dto/createPlanAsignaturaPrerequisito.dto';
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
    @Get('plan-regimen/:idplan/:idregimen')
    async getAsignaturasByPlanRegimen(
      @Param('idplan', ParseIntPipe) idplan: number, 
      @Param('idregimen', ParseIntPipe) idregimen: number){
       return await this.planEstudioAsignaturaService.getAsignaturasByPlanRegimen(idplan, idregimen);
    }

    @Get('plan-estudio-carrera/:id')
    async getAsignaturasPrerequisitosByPlan(
      @Param('id', ParseIntPipe) id: number, 
      ){
       return await this.planEstudioAsignaturaService.getAsignaturasPrerequisitosByPlan(id);
    }

    @Post()
    async addPlanAsignatura(@Body() dto: CreatePlanEstudioAsignaturaDto[]) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignatura(dto);
    }

    @Post('prerequisito')
    async addPlanEstudioAsignaturaPrerequisito(@Body() dto: CreatePlanAsignaturaPrerequisitoDto[]) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignaturaPrerequisito(dto);
    }
}
