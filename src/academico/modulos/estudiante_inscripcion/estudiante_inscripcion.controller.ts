import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { CreateEstudianteInscripcionOfertaDto } from './dto/createEstudianteInscripcionOferta.dto';
import { EstudianteInscripcionService } from './estudiante_inscripcion.service';

@ApiTags('estudiante-inscripcion')
@Controller('estudiante-inscripcion')
export class EstudianteInscripcionController {
    constructor (
        private readonly estudianteInscripcionService: EstudianteInscripcionService
        ){}
        
    @Get()
    async getAll():Promise<EstudianteInscripcion[]>{
        return await this.estudianteInscripcionService.findAllEstudiantes();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number){
        
        return await this.estudianteInscripcionService.findEstudianteInscripcion(id);
    }

    @Post()
    async createInscripcion(@Body() dto: CreateEstudianteInscripcionDto){
        console.log('controller insert',dto);
        return  await this.estudianteInscripcionService.createEstudianteInscripcion(dto);        
    }

    //TODO LOGICA CON ASIGNATURAS
    @Post('oferta')
    async createInscripcionOferta(@Body() dto: CreateEstudianteInscripcionOfertaDto){
        //console.log('controller insert',dto);
        return  await this.estudianteInscripcionService.createEstudianteInscripcionOferta(dto);        
    }
}
