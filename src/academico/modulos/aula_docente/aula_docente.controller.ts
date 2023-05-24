import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AulaDocenteService } from './aula_docente.service';

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
}
