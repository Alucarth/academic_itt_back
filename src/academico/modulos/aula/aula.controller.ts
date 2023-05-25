import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AulaService } from './aula.service';

@Controller('aula')
export class AulaController {
    constructor (
        private readonly aulaService: AulaService,
        ){}

    @Get()
    async getAllBy(){
        return await this.aulaService.getAll();
    }
    @Get(':id')
    async getById(@Param("id", ParseIntPipe) id: number){
        return await this.aulaService.getById(id);
    }
}
