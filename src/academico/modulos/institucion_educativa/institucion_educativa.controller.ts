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
        @Get('itt')
        async getAllItt():Promise<InstitucionEducativa[]>{
            return await this.institucionEducativaService.getAllItt();
        }

        @Get(':id')
        async getBySie(@Param('id', ParseIntPipe) id: number):Promise<InstitucionEducativa[]>{
            return await this.institucionEducativaService.findBySie(id);
        }
       
}
