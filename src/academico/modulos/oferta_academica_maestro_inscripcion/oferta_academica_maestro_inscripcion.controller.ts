import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';
import { OfertaAcademicaMaestroInscripcionService } from './oferta_academica_maestro_inscripcion.service';

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

}

