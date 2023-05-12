import { Controller, Get, Param } from '@nestjs/common';
import { PlanEstudioCarreraService } from './plan_estudio_carrera.service';

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

    @Get('carrera/:id')
    async getPlanesCarreraAutorizadaId(@Param('id') id: number){
       return await this.planEstudioCarreraService.planesCarreraId(id);
    }
    @Get('list-resoluciones/:carrera_id/:nivel_id/:area_id/:intervalo_id/:tiempo')
    async getResolucionesCarreraNivelTiempo(
        @Param('carrera_id') carrera_id: number,
        @Param('nivel_id') nivel_id: number,
        @Param('area_id') area_id: number,
        @Param('intervalo_id') intervalo_id: number,
        @Param('tiempo') tiempo: number,
        ){
        console.log("asas");
       return await this.planEstudioCarreraService.getResolucionesByCarreraId(
        carrera_id,
        nivel_id,
        area_id,
        intervalo_id,
        tiempo);
    }
}
