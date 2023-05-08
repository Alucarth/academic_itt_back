import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaAcreditacionEtapaEducativa } from 'src/academico/entidades/institucionEducativaAcreditacionEtapaEducativa.entity';
import { InstitucionEducativaAcreditacionEtapaEducativaService } from './institucion_educativa_acreditacion_etapa_educativa.service';

@ApiTags('institucion-educativa-acreditacion-etapa-educativa')
@Controller('institucion-educativa-acreditacion-etapa-educativa')
export class InstitucionEducativaAcreditacionEtapaEducativaController {
    constructor (
        private readonly institucionEducativaAcreditacionEtapaEducativaService: InstitucionEducativaAcreditacionEtapaEducativaService 
        ){}
    @Get()
    async getAll():Promise<InstitucionEducativaAcreditacionEtapaEducativa[]>{
        return await this.institucionEducativaAcreditacionEtapaEducativaService.getAll();
    }
    @Get('carreras/:sie')
    async getAllCarrerasSie( @Param("sie", ParseIntPipe) sie: number){
        return await this.institucionEducativaAcreditacionEtapaEducativaService.getCarrerasBySie(sie);
    }
}
