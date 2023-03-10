import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';
import { InstitucionEducativaCursoService } from './institucion_educativa_curso.service';

@ApiTags('institucion-educativa-curso')
@Controller('institucion-educativa-curso')
export class InstitucionEducativaCursoController {
    constructor (
        private readonly institucionEducativaCursoService: InstitucionEducativaCursoService 
        ){}

    @Get(':id')
    async getById():Promise<InstitucionEducativaCurso[]>{
        return await this.institucionEducativaCursoService.getAll();
    }

    @Post()
    async createCurso(@Body() dto: CreateInstitucionEducativaCursoDto){
        const data = await this.institucionEducativaCursoService.createCurso(dto);
        return data
    }
}
