import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';

@Controller('instituto-estudiante-inscripcion-docente-calificacion')
export class InstitutoEstudianteInscripcionDocenteCalificacionController {
    constructor (
        private readonly inscripcionDocenteCalificacionService: InstitutoEstudianteInscripcionDocenteCalificacionService,
        ){}

    @Get()
    async getAllBy(){
        return await this.inscripcionDocenteCalificacionService.getAll();
    }
    @Post()
    async createOfertaCurricular(@Body() dto: CreateInstitutoInscripcionDocenteCalificacionDto[]){
        return  await this.inscripcionDocenteCalificacionService.crearInscripcionDocenteCalificacion(dto);        
    }

}
