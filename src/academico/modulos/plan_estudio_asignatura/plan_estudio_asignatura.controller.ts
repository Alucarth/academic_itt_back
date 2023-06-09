import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { CreatePlanAsignaturaPrerequisitoDto } from './dto/createPlanAsignaturaPrerequisito.dto';
import { PlanEstudioAsignaturaService } from './plan_estudio_asignatura.service';
import { UpdatePlanEstudioAsignaturaDto } from './dto/updatePlanEstudioAsignatura.dto';

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
    @Get('plan-asignatura/:idplan/:idasignatura')
    async getIdByPlanAsignatura(
      @Param('idplan', ParseIntPipe) idplan: number, 
      @Param('idasignatura', ParseIntPipe) idasignatura: number){
       return await this.planEstudioAsignaturaService.getOneByPlanAsignatura(idplan, idasignatura);
    }

    @Get('plan-estudio-carrera/:id')
    async getAsignaturasPrerequisitosByPlan(
      @Param('id', ParseIntPipe) id: number, 
      ){
       return await this.planEstudioAsignaturaService.getAsignaturasPrerequisitosByPlan(id);
    }

    @Post()
    async addPlanAsignatura(@Body() dto: CreatePlanAsignaturaPrerequisitoDto[]) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignatura(dto);
    }

    @Post('prerequisito')
    async addPlanEstudioAsignaturaPrerequisito(@Body() dto: CreatePlanAsignaturaPrerequisitoDto[]) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignaturaPrerequisito(dto);
      //return await this.planEstudioAsignaturaService.createPlanAsignaturaPre(dto);
    }

    @Put(':id')
    async editOperativoCarrera(@Param('id') id: number, @Body() dto: UpdatePlanEstudioAsignaturaDto){
        const data = await this.planEstudioAsignaturaService.editPlanEstudioAsignaturaById(id,dto);
        return data;
    }
}
