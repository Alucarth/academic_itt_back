import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { CreateJurisdiccionGeograficaDto } from './dto/createJurisdiccionGeografica.dto';
import { UpdateJurisdiccionGeograficaDto } from './dto/updateJurisdiccionGeografica.dto';
import { JurisdiccionGeograficaService } from './jurisdiccion_geografica.service';

@ApiTags('jurisdiccion-geografica')
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
   
    @Get('2001/codigo/:id') //con censo 2001
    async getOne2001ByCodigo(@Param('id') id: number){
        return await this.jurisdiccionGeograficaService.findJurisdiccionGeografica2001Codigo(id);
    }

    @Get('2012/codigo/:id') //con censo 2012
    async getOne2012ByCodigo(@Param('id') id: number){
        return await this.jurisdiccionGeograficaService.findJurisdiccionGeografica2012Codigo(id);
    }

    @Post()
    async createJurisdiccionGeografica(@Body() dto: CreateJurisdiccionGeograficaDto){
        console.log('controller insert',dto);
        return  await this.jurisdiccionGeograficaService.createJurisdiccionGeografica(dto);        
    }
   
    @Put(':id')
    async updateJurisdiccionGeografica(@Param('id') id: number, @Body() dto: UpdateJurisdiccionGeograficaDto){
        console.log('controller update',dto);
        return  await this.jurisdiccionGeograficaService.updateJurisdiccionGeografica(id, dto);        
    }
   

}
