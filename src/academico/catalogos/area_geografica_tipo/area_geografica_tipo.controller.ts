import { Controller, Get } from '@nestjs/common';
import { AreaGeograficaTipo } from 'src/academico/entidades/areaGeograficaTipo.entity';
import { AreaGeograficaTipoService } from './area_geografica_tipo.service';

@Controller('area-geografica-tipo')
export class AreaGeograficaTipoController {
    constructor (
        private readonly areaGeograficaTipoService: AreaGeograficaTipoService 
    ){}

    @Get()
    async getAll():Promise<AreaGeograficaTipo[]>{
        return await this.areaGeograficaTipoService.getAll();
    }
}
