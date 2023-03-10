import { Controller, Get } from '@nestjs/common';
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
}
