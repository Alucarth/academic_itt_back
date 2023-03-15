import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OfertaAcademicaService } from './oferta_academica.service';

@Controller('oferta-academica')
export class OfertaAcademicaController {
    constructor(
        private readonly ofertaAcademicaService: OfertaAcademicaService
    ){}

    @Get('curso/:id')
    async getAsignaturasByEspecialidad(@Param('id', ParseIntPipe) id: number):Promise<OfertaAcademica[]>{
        return await this.ofertaAcademicaService.findAsignaturasByCursoId(id);
    }
}

