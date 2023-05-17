import { Controller, Get, Param } from '@nestjs/common';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource } from 'typeorm';
import { OfertaCurricularService } from './oferta_curricular.service';

@Controller('oferta-curricular')
export class OfertaCurricularController {
    constructor (
        private readonly ofertaCurricularService: OfertaCurricularService,
        
        ){}

    @Get()
    async getAllBy(){
        return await this.ofertaCurricularService.getAll();
    }
    @Get('carrera/:id')
    async getAllByCarrera(@Param('id') id: number){
        return await this.ofertaCurricularService.getAllByCarreraId(id);
    }
    
}
