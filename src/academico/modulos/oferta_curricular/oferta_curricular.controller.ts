import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource } from 'typeorm';
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';
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

    @Get('byCarreraGestionPeriodo/:id/:gestion/:periodo')
    async getAllAsignaturasByCarreraGestionPeriodo(
        @Param('id') id: number,
        @Param('gestion') gestion: number,
        @Param('periodo') periodo: number){
        return await this.ofertaCurricularService.getAllAsignaturasByCarreraGestionPeriodo(id,gestion,periodo);
    }
    
    @Post()
    async createOfertaCurricular(@Body() dto: CreateOfertaCurricularDto[]){
       /* console.log('controller insert');
        console.log(dto);
        console.log("fin");*/
     //   return  await this.ofertaCurricularService.createOfertaCurricular(dto);        
        return  await this.ofertaCurricularService.crear(dto);        
    }
    
}
