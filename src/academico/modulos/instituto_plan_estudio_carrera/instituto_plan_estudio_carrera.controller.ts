import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';
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
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number){
        return await this.institutoPlanEstudioCarreraService.getPlanAsignaturaById(id);
    }
    @Get('id/:id')
    async getOneById(@Param('id', ParseIntPipe) id: number){
        
        return await this.institutoPlanEstudioCarreraService.getOneById(id);
    }
    
    @Post()
    async createCurso(@Body() dto: CreateInstitutoPlanEstudioCarreraDto){
        console.log('controller insert',dto);
        return  await this.institutoPlanEstudioCarreraService.createInstitutoPlan(dto);        
    }
}
