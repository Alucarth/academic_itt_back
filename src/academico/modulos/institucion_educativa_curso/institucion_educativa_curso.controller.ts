import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { InstitucionEducativaSucursalService } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.service';
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';
import { UpdateInstitucionEducativaCursoDto } from './dto/updateInstitucionEducativaCurso';
import { InstitucionEducativaCursoService } from './institucion_educativa_curso.service';

@ApiTags('institucion-educativa-curso')
@Controller('institucion-educativa-curso')
export class InstitucionEducativaCursoController {
    constructor (
        private readonly institucionEducativaCursoService: InstitucionEducativaCursoService,
        
        ){}

    @Get(':id')
    async getById():Promise<InstitucionEducativaCurso[]>{
        return await this.institucionEducativaCursoService.getAll();
    }
    @Get('sie-gestion-periodo/:sie/:gestion/:periodo')
    async getBySie(@Param('sie') sie: number,@Param('gestion') gestion: number,@Param('periodo') periodo: number):Promise<InstitucionEducativaCurso[]>{
        return await this.institucionEducativaCursoService.getBySie(sie, gestion, periodo);
    }

    @Get('etapa-gestion-periodo/:id/:gestion/:periodo') //etapa es la carrera
    async getByCarrera(@Param('id') id: number,@Param('gestion') gestion: number,@Param('periodo') periodo: number):Promise<InstitucionEducativaCurso[]>{
        return await this.institucionEducativaCursoService.getByEtapa(id, gestion, periodo);
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
