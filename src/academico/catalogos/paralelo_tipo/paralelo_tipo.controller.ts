import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ParaleloTipo } from 'src/academico/entidades/paraleloTipo.entity';
import { ParaleloTipoService } from './paralelo_tipo.service';

@Controller('paralelo-tipo')
export class ParaleloTipoController {
    constructor (
        private readonly paraleloTipoService: ParaleloTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.paraleloTipoService.getAll();
    }
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number):Promise<ParaleloTipo>{
        return await this.paraleloTipoService.getById(id);
    }
}
