import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaAcreditacionEspecialidad } from 'src/academico/entidades/institucionEducativaAcreditacionEspecialidad.entity';
import { InstitucionEducativaAcreditacionEspecialidadService } from './institucion_educativa_acreditacion_especialidad.service';

@ApiTags('acreditacion-especialidad')
@Controller('institucion-educativa-acreditacion-especialidad')
export class InstitucionEducativaAcreditacionEspecialidadController {
    constructor(
        private readonly institucionEducativaAcreditacionEspecialidadService: InstitucionEducativaAcreditacionEspecialidadService
    ){}

    @Get('sucursal/:id')
    async getEspecialidadesBySie(@Param('id', ParseIntPipe) id: number):Promise<InstitucionEducativaAcreditacionEspecialidad[]>{
        return await this.institucionEducativaAcreditacionEspecialidadService.findEspecialidadesBySie(id);
    }


}
