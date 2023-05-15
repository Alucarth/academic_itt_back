import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPLanEstudioCarrera.entity';
import { InstitutoPlanEstudioCarreraService } from './instituto_plan_estudio_carrera.service';

@Controller('instituto-plan-estudio-carrera')
export class InstitutoPlanEstudioCarreraController {
    constructor(
        private readonly institutoPlanEstudioCarreraService: InstitutoPlanEstudioCarreraService
    ){}

    @Get()
    async getAllIttSucursales(){
        return await this.institutoPlanEstudioCarreraService.getAll();
    }
    @Get('carrera/:id')
    async getResolucionesCarreraAutorizadaById(@Param('id', ParseIntPipe) id: number){
        return await this.institutoPlanEstudioCarreraService.getResolucionesCarreraAutorizadaId(id);
    }
}
