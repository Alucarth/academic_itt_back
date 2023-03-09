import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaService } from './institucion_educativa.service';

@ApiTags('institucion-educativa')
@Controller('institucion-educativa')
export class InstitucionEducativaController {
    constructor (
        private readonly institucionEducativaService: InstitucionEducativaService 
        ){}
    @Get()
    async getAll():Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.getAll();
    }
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number):Promise<InstitucionEducativa>{
        return await this.institucionEducativaService.getById(id);
    }

    @Get('itt')
    async getAllItt():Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.getAllItt();
    }

    @Get('sie/:sie')
    async getBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findBySie(sie);
    }

    @Get('acreditacion/:sie')
    async getAcreditdoBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findAcreditacionBySie(sie);
    }
    @Get('itt/:sie')
    async getOneIttBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa>{
        return await this.institucionEducativaService.findOneAcreditadoBySie(sie);
    }

    @Get('carreras/:sie')
    async getEtapasBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findEtapasBySie(sie);
    }
       
    @Get('lista-carreras/:sie')
    async getCarrerasBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativa[]>{
        return await this.institucionEducativaService.findCarrerasBySie(sie);
    }
      
}
