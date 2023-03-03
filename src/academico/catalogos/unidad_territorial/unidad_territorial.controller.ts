import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnidadTerritorial } from 'src/academico/entidades/unidadTerritorial.entity';
import { UnidadTerritorialService } from './unidad_territorial.service';

@ApiTags('unidad-territorial')
@Controller('unidad-territorial')
export class UnidadTerritorialController {
    constructor (
        private readonly unidadTerritorialService: UnidadTerritorialService 
    ){}

    @Get()
    async getAll():Promise<UnidadTerritorial[]>{
        return await this.unidadTerritorialService.getAll();
    }
}
