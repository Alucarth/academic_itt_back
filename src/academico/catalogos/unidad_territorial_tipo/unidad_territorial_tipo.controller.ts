import { Controller, Get } from '@nestjs/common';
import { UnidadTerritorialTipo } from 'src/academico/entidades/unidadTerritorialTipo.entity';
import { UnidadTerritorialTipoService } from './unidad_territorial_tipo.service';

@Controller('unidad-territorial-tipo')
export class UnidadTerritorialTipoController {
    constructor (
        private readonly unidadTerritorialTipoService: UnidadTerritorialTipoService 
    ){}

    @Get()
    async getAll():Promise<UnidadTerritorialTipo[]>{
        return await this.unidadTerritorialTipoService.getAll();
    }
}
