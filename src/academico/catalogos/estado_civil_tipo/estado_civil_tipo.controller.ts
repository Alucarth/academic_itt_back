import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EstadoCivilTipo } from 'src/academico/entidades/estadoCivilTipo.entity';
import { EstadoCivilTipoService } from './estado_civil_tipo.service';

@ApiTags('estado-civil-tipo')
@Controller('estado-civil-tipo')
export class EstadoCivilTipoController {
    constructor (
        private readonly estadoCivilTipoService: EstadoCivilTipoService 
    ){}
    
    @Get()
    async getAll():Promise<EstadoCivilTipo[]>{
        return await this.estadoCivilTipoService.getAll();
    }
}
