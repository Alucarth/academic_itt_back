import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Persona } from 'src/users/entity/persona.entity';
import { SearchDatoDto } from './dto/searchDato.dto';
import { CreatePersonaoDto } from './dto/createPersona.dto';
import { PersonaService } from './persona.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('persona')
@Controller('persona')
export class PersonaController {
    constructor(
        private readonly personaService: PersonaService
    ){}

    @Get(':id')
    async getPersonaById(@Param('id', ParseIntPipe) id: number):Promise<Persona[]>{
        return await this.personaService.findPersona(id);
    }
    @Post('busqueda')
    async getPersonaByCiComplemento(@Body() dto: SearchDatoDto){
        console.log("fin dratp 1");
        console.log(dto);
        console.log("fin dratp 2");
        return await this.personaService.findPersonaByDato(dto);
        
    }

    @Post()
    async createPersona(@Body() dto: CreatePersonaoDto){
        console.log('controller insert',dto);
        return  await this.personaService.createPersona(dto);        
    }
}
