import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OperativoEtapaEducativa } from 'src/academico/entidades/operativoEtapaEducativa.entity';
import { OperativoEtapaEducativaService } from './operativo_etapa_educativa.service';

@Controller('operativo-etapa-educativa')
@ApiTags('operativo-etapa-educativa')
export class OperativoEtapaEducativaController {
    constructor (
        private readonly operativoEtapaEducativaService: OperativoEtapaEducativaService
        ){}

    @Get(':id')
    async getById():Promise<OperativoEtapaEducativa[]>{
        return await this.operativoEtapaEducativaService.getAll();
    }
    @Get('etapa/:id')
    async getByEtapaEducativaId(@Param('id', ParseIntPipe) id: number):Promise<OperativoEtapaEducativa[]>{
        const data = await this.operativoEtapaEducativaService.getByEtapaEducativaId(id);
        console.log(data);
        return data;
    }
}
