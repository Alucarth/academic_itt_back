import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
    @Get('aula/:id')
    async getAllCalificacionesByAulaId(@Param('id') id: number,){
        return await this.inscripcionDocenteCalificacionService.getAllCalificacionesByAulaId(id);
    }
    @Get('inscripcion/:id')
    async getAllCalificacionesByInscripcionId(@Param('id') id: number,){
        return await this.inscripcionDocenteCalificacionService.getAllCalificacionesByInscripcionId(id);
    }
    
    @Get('promedios/aula-periodo/:id/:periodo')
    async getAllPromedioCalificacionByAulaId(@Param('id') id: number, @Param('periodo') periodo: number){
        return await this.inscripcionDocenteCalificacionService.createUpdatePromedioCalificacionByAulaId(id, periodo);
    }
    @Get('estados-finales/aula/:id')
    async getAllEstadosFinalesByAulaId(@Param('id') id: number){
        return await this.inscripcionDocenteCalificacionService.updateEstadosFinalesByAulaId(id);
    }
    @Post()
    async createInscripcionDocenteCalificacionGlobal(@Body() dto: CreateInstitutoInscripcionDocenteCalificacionDto[]){
        return  await this.inscripcionDocenteCalificacionService.crearInscripcionDocenteCalificacionGlobal(dto);        
    }

}
