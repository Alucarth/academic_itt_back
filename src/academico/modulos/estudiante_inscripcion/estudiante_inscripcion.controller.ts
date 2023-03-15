import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { CreateEstudianteInscripcionDto } from './dto/createEstudianteInscripcion.dto';
import { EstudianteInscripcionService } from './estudiante_inscripcion.service';

@ApiTags('estudiante-inscripcion')
@Controller('estudiante-inscripcion')
export class EstudianteInscripcionController {
    constructor (
        private readonly estudianteInscripcionService: EstudianteInscripcionService
        ){}
        
    @Get(':id')
    async getAll():Promise<EstudianteInscripcion[]>{
        return await this.estudianteInscripcionService.findEstudiantes();
    }

    @Post()
    async createCurso(@Body() dto: CreateEstudianteInscripcionDto){
        console.log('controller insert',dto);
        return  await this.estudianteInscripcionService.createEstudianteInscripcion(dto);        
    }
}
