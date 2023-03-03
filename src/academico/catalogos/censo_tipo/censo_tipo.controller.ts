import { Controller, Get } from '@nestjs/common';
import { CensoTipo } from 'src/academico/entidades/censoTipo.entity';
import { CensoTipoService } from './censo_tipo.service';

@Controller('censo-tipo')
export class CensoTipoController {
    constructor (
        private readonly censoTipoService: CensoTipoService 
    ){}

    @Get()
    async getAll():Promise<CensoTipo[]>{
        return await this.censoTipoService.getAll();
    }
}
