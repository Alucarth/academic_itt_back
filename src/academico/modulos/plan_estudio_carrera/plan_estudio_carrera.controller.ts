import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreatePlanEstudioCarreraDto, UpdatePlanEstudioCarreraDto } from './dto/createPlanEstudioCarrera.dto';
import { PlanEstudioCarreraService } from './plan_estudio_carrera.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';


@Controller('plan-estudio-carrera')
export class PlanEstudioCarreraController {
    constructor(
        private readonly planEstudioCarreraService: PlanEstudioCarreraService
    ){}

    @Get()
    async getPlanesCarrerasAll(){
       return await this.planEstudioCarreraService.getResolucionesAll();
    }

    @Get('resolucion/:id')
    async getPlanesResoluciones(@Param('id') id: number,){
       return await this.planEstudioCarreraService.getCarrerasResolucionId(id);
    }

    @Get(':id')
    async getPlanEstudioCarrera(@Param('id') id: number)
    {
      return await this.planEstudioCarreraService.getPlanEstudioCarrera(id)
    }

    @Get('carrera/:id')
    async getPlanesCarreraAutorizadaId(@Param('id') id: number){
       return await this.planEstudioCarreraService.getPlanesCarreraById(id);
    }
    @Get('asignaturas-carrera/:id')
    async getPlanAsignaturaCarreraAutorizadaId(@Param('id') id: number){
       return await this.planEstudioCarreraService.getPlanAsignaturaCarreraById(id);
    }

    @Get('list-resoluciones/:carrera_id/:nivel_id/:area_id/:intervalo_id/:tiempo/:carga')
    async getResolucionesCarreraNivelTiempo(
        @Param('carrera_id') carrera_id: number,
        @Param('nivel_id') nivel_id: number,
        @Param('area_id') area_id: number,
        @Param('intervalo_id') intervalo_id: number,
        @Param('tiempo') tiempo: number,
        @Param('carga') carga: number,
        ){
        console.log("asas");
       return await this.planEstudioCarreraService.getResolucionesByData(
        carrera_id,
        nivel_id,
        area_id,
        intervalo_id,
        tiempo,
        carga);
    }

     @Put(':id')
     async updateById(
         @Param('id', ParseIntPipe) id: number,
         @Body() updateData: UpdatePlanEstudioCarreraDto,
     ) {
        return this.planEstudioCarreraService.upadtePlanEstudioCarrera(id, updateData);
     }

    @Get('resoluciones-carrera/:id')
    async getResolucionesCarrerId(@Param('id') id: number){
       return await this.planEstudioCarreraService.getResolucionesByCarreraId(id);
    }
    
    @Get('resoluciones-carrera-autorizada/:id')
    async getResolucionesCarreraAutorizadaId(@Param('id') id: number){
       return await this.planEstudioCarreraService.getResolucionesByCarreraAutorizadaId(id);
    }
    
    @Auth()
    @Post()
    async addPlanEstudioCarrera(@Body() dto: CreatePlanEstudioCarreraDto, @Users() user: UserEntity) {
      console.log("-*************-");
      return await this.planEstudioCarreraService.crearPlanEstudioCarrera(dto, user);
    }


}
