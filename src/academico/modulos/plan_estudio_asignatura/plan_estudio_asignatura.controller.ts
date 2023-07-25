import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { CreatePlanAsignaturaPrerequisitoDto } from './dto/createPlanAsignaturaPrerequisito.dto';
import { PlanEstudioAsignaturaService } from './plan_estudio_asignatura.service';
import { UpdatePlanEstudioAsignaturaDto } from './dto/updatePlanEstudioAsignatura.dto';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

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

    @Get('asignaturas/:plan_estudio_asignatura_id')
    async getAsignaturasPlanEstudioById( @Param('plan_estudio_asignatura_id',ParseIntPipe) plan_estudio_asignatura_id: number )
    {
      console.log(plan_estudio_asignatura_id)
      //return await this.planEstudioAsignaturaService.getAsignaturasPlanEstudioById(plan_estudio_asignatura_id);
    }
    @Auth()
    @Post()
    async addPlanAsignatura(@Body() dto: CreatePlanAsignaturaPrerequisitoDto[], @Users() user: UserEntity) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignatura(dto, user);
    }
    @Auth()
    @Post('prerequisito')
    async addPlanEstudioAsignaturaPrerequisito(@Body() dto: CreatePlanAsignaturaPrerequisitoDto[], @Users() user: UserEntity) {
      console.log("-*************-");
      return await this.planEstudioAsignaturaService.crearPlanAsignaturaPrerequisito(dto,user);
      //return await this.planEstudioAsignaturaService.createPlanAsignaturaPre(dto);
    }
    @Auth()
    @Put(':id')
    async editOperativoCarrera(@Param('id') id: number, @Body() dto: UpdatePlanEstudioAsignaturaDto, @Users() user: UserEntity){
        const data = await this.planEstudioAsignaturaService.editPlanEstudioAsignaturaById(id,dto, user);
        return data;
    }
}
