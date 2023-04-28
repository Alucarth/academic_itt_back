import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';
import { OfertaAcademicaMaestroInscripcionService } from './oferta_academica_maestro_inscripcion.service';

@ApiTags('oferta-academica-maestro-inscripcion')
@Controller('oferta-academica-maestro-inscripcion')
export class OfertaAcademicaMaestroInscripcionController {
    constructor(private readonly ofertaMaestroInscripcionService: OfertaAcademicaMaestroInscripcionService) {}
    
    @Post()
    async addOfertaAcademicaMaestroInscripcion(@Body() dto: CreateOfertaAcademicaMaestroInscripcionDto) {
      console.log("-*************-");
      console.log("controller/mastro-insc/oferta-acad new", dto);
      
      return await this.ofertaMaestroInscripcionService.createOFertaAcademicaMaestroInscripcion(dto);
    }

    @Get('etapa-gestion-periodo/:id/:gestion/:periodo') //etapa es la carrera
    async getByCarrera(@Param('id') id: number,@Param('gestion') gestion: number,@Param('periodo') periodo: number):Promise<OfertaAcademicaMaestroInscripcion[]>{
        return await this.ofertaMaestroInscripcionService.getByEtapa(id, gestion, periodo);
    }

    @Get('ofertas-academicas/:id') //etapa es la carrera
    async getOfertasAcademicasByMaestroId(@Param('id') id: number):Promise<OfertaAcademicaMaestroInscripcion[]>{
        return await this.ofertaMaestroInscripcionService.getOfertasAcademicas(id);
    }

    @Delete(':id')
    async deleteOne(@Param('id') id: number) {
        console.log('controller delete',id);
        const data = await this.ofertaMaestroInscripcionService.deleteOfertaAcademicaMaestroInscripcion(id);
        return { message: 'Se eliminó  el dato', data };
    }

}

