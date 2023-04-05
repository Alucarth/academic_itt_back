import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FinanciamientoTipo } from 'src/academico/entidades/financiamientoTipo.entity';
import { FinanciamientoTipoService } from './financiamiento_tipo.service';

@ApiTags('financiamiento-tipo')
@Controller('financiamiento-tipo')
export class FinanciamientoTipoController {

    constructor(
        private readonly financiamientoTipoService: FinanciamientoTipoService
    ){}
    @Get()
    async getAll(){
        return await this.financiamientoTipoService.getAll();
    }


}
