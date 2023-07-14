import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { Persona } from 'src/users/entity/persona.entity';
import { SearchDatoDto } from './dto/searchDato.dto';
import { CreatePersonaoDto } from './dto/createPersona.dto';
import { PersonaService } from './persona.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePersonaoDto } from './dto/updatePersona.dto';

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
        const res = await this.personaService.findPersonaByDato(dto);
        console.log(res);
        return res

    }

    @Post()
    async createPersona(@Body() dto: CreatePersonaoDto){
        console.log('controller insert',dto);
        return  await this.personaService.createPersona(dto);        
    }

    @Put()
    async updatePersona(@Body() dto: UpdatePersonaoDto){
        //console.log('controller update',dto);
        return  await this.personaService.updatePersona(dto);        
    }

    @Get('/historialAcademico/:id/:sie/:caId')
    async getHistorialPersonaById(
        @Param('id', ParseIntPipe) id: number,
        @Param('sie', ParseIntPipe) sie: number,
        @Param('caId', ParseIntPipe) caId: number,
        ){
        return await this.personaService.historialPersona(id, sie, caId);
    }

    @Get('/buscadorGestionPeriodo/:sie')
    async getBuscadorGestionPeriodo(        
        @Param('sie', ParseIntPipe) sie: number
        ){
        return await this.personaService.buscadorGestionPeriodo(sie);
    }

    @Get('/getCarrerasByPersonaId/:id')
    async getCarrerasByPersonaById(
        @Param('id', ParseIntPipe) id: number,        
        ){
        return await this.personaService.getCarrerasByPersonaId(id);
    }


}
