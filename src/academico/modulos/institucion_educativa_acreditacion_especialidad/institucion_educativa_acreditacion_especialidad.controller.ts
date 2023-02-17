import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaAcreditacionEspecialidad } from 'src/academico/entidades/institucion_educativa_acreditacion_especialidad.entity';
import { InstitucionEducativaAcreditacionEspecialidadService } from './institucion_educativa_acreditacion_especialidad.service';

@ApiTags('acreditacion-educativa')
@Controller('institucion-educativa-acreditacion-especialidad')
export class InstitucionEducativaAcreditacionEspecialidadController {
    constructor(
        private readonly institucionEducativaAcreditacionEspecialidadService: InstitucionEducativaAcreditacionEspecialidadService
    ){}

    @Get('especialidades/:id')
    async getEspecialidadesBySie(@Param('id', ParseIntPipe) id: number):Promise<InstitucionEducativaAcreditacionEspecialidad[]>{
        return await this.institucionEducativaAcreditacionEspecialidadService.findEspecialidadesBySie(id);
    }


}
