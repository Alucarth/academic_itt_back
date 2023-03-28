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
        const dato = await this.personaService.findPersonaByDato(dto);
        console.log(dato);
        return dato;
    }

    @Post()
    async createPersona(@Body() dto: CreatePersonaoDto){
        console.log('controller insert',dto);
        return  await this.personaService.createPersona(dto);        
    }
}