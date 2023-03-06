import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TurnoTipo } from 'src/academico/entidades/turnoTipo.entity';
import { TurnoTipoService } from './turno_tipo.service';

@ApiTags('turno-tipo')
@Controller('turno-tipo')
export class TurnoTipoController {
    constructor (
        private readonly turnoTipoService: TurnoTipoService 
        ){}

    @Get()
    async getAll():Promise<TurnoTipo[]>{
        return await this.turnoTipoService.getAll();
    }
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number):Promise<TurnoTipo>{
        return await this.turnoTipoService.getById(id);
    }
}
