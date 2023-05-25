import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AulaDocenteService } from './aula_docente.service';
import { CreateAulaDocenteDto } from './dto/createAulaDocente.dto';

@Controller('aula-docente')
export class AulaDocenteController {
    constructor (
        private readonly aulaDocenteService: AulaDocenteService,
        ){}

    @Get()
    async getAllBy(){
        return await this.aulaDocenteService.getAll();
    }

    @Get('carrerasByDocenteId/:id')
    async getAllCarrerasByDocente(@Param("id", ParseIntPipe) id: number){
        return await this.aulaDocenteService.getCarrerasByDocenteId(id);
    }
    @Post()
    async createOfertaCurricular(@Body() dto: CreateAulaDocenteDto[]){
          
        return  await this.aulaDocenteService.crearDocenteAula(dto);        
    }
}