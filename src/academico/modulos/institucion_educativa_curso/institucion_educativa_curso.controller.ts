import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';
import { UpdateInstitucionEducativaCursoDto } from './dto/updateInstitucionEducativaCurso';
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
        console.log('controller insert',dto);
        return  await this.institucionEducativaCursoService.createCurso(dto);        
    }

    @Put('/')   
    async updateCurso(@Body() dto: UpdateInstitucionEducativaCursoDto) {
        console.log('controller update',dto);
        return  await this.institucionEducativaCursoService.updateCurso(dto);
    }
    
    @Delete(':id')
    async deleteOne(@Param('id') id: number) {
        console.log('controller delete',id);
        const data = await this.institucionEducativaCursoService.deleteCursoOferta(id);
        return { message: 'Se eliminó  el caso', data };
    }

    
}
