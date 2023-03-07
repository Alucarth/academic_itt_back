import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PeriodoTipo } from 'src/academico/entidades/periodoTipo.entity';
import { PeriodoTipoService } from './periodo_tipo.service';

@Controller('periodo-tipo')
@ApiTags('periodo-tipo')
export class PeriodoTipoController {
    constructor (
        private readonly periodoTipoService: PeriodoTipoService
        ){}

    @Get()
    async getAll():Promise<PeriodoTipo[]>{
        return await this.periodoTipoService.getAll();
    }
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number):Promise<PeriodoTipo>{
        return await this.periodoTipoService.getById(id);
    }
}
