import { Controller, Get } from '@nestjs/common';
import { EspecialidadTipo } from 'src/academico/entidades/especialidadTipo.entity';
import { EspecialidadTipoService } from './especialidad_tipo.service';

@Controller('especialidad-tipo')
export class EspecialidadTipoController {
    constructor(
        private readonly especialidadTipoService: EspecialidadTipoService
    ){}
    @Get()
    async getAll():Promise<EspecialidadTipo[]>{
        return await this.especialidadTipoService.getAll();
    }
}
