import { Body, Controller, Post } from '@nestjs/common';
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

}

