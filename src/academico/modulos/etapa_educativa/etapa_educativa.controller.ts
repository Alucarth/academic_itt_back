import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EtapaEducativa } from 'src/academico/entidades/etapaEducativa.entity';
import { EtapaEducativaService } from './etapa_educativa.service';

@ApiTags('etapa-educativa')
@Controller('etapa-educativa')
export class EtapaEducativaController {
    constructor (
        private readonly etapaEducativaService: EtapaEducativaService 
        ){}
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number):Promise<EtapaEducativa>{
        return await this.etapaEducativaService.getById(id);
    }

    @Get('hijos/:id')
    async getHijosAll(@Param('id', ParseIntPipe) id: number):Promise<EtapaEducativa[]>{
        return await this.etapaEducativaService.findAllRecursiveHijos(id);
    }

    @Get('padres/:id')
    async getAll(@Param('id', ParseIntPipe) id: number):Promise<EtapaEducativa[]>{
        return await this.etapaEducativaService.findAllRecursivePadres(id);
    }
    @Get('asignaturas/regimen/:id')
    async getAllAsignaturas(@Param('id', ParseIntPipe) id: number):Promise<EtapaEducativa[]>{
        return await this.etapaEducativaService.findAsignaturasRegimenCarrera(id);
    }

    @Get('carrerasBySie/:id')
    async getAllCarrerasBySie(@Param('id', ParseIntPipe) id: number){
        return await this.etapaEducativaService.findCarrerasBySie(id);
    }

    @Get('asiganturasByCarreraId/:id')
    async getAllAsignaturasByCarreraId(@Param('id', ParseIntPipe) id: number):Promise<EtapaEducativa[]>{
        return await this.etapaEducativaService.findAsignaturasRegimenCarrera(id);
    }


  
   
}
