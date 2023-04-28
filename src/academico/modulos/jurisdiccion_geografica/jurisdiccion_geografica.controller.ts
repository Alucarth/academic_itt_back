import { Controller, Get, Param } from '@nestjs/common';
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { JurisdiccionGeograficaService } from './jurisdiccion_geografica.service';

@Controller('jurisdiccion-geografica')
export class JurisdiccionGeograficaController {

     constructor (
        private readonly jurisdiccionGeograficaService: JurisdiccionGeograficaService 
        ){}

    @Get()
    async getAll():Promise<JurisdiccionGeografica[]>{
        return await this.jurisdiccionGeograficaService.getAll();
    }

    @Get('/:id')
    async getOneById(@Param('id') id: number){
        return await this.jurisdiccionGeograficaService.findJurisdiccionGeografica(id);
    }

   
    @Get('2001/codigo/:id')
    async getOne2001ByCodigo(@Param('id') id: number){
        return await this.jurisdiccionGeograficaService.findJurisdiccionGeografica2001Codigo(id);
    }

    @Get('2012/codigo/:id')
    async getOne2012ByCodigo(@Param('id') id: number){
        return await this.jurisdiccionGeograficaService.findJurisdiccionGeografica2012Codigo(id);
    }

}
