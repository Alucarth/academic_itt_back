import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EspecialidadTipo } from 'src/academico/entidades/especialidadTipo.entity';
import { EspecialidadTipoService } from './especialidad_tipo.service';

@ApiTags('especialidad-tipo')
@Controller('especialidad-tipo')
export class EspecialidadTipoController {
    constructor(
        private readonly especialidadTipoService: EspecialidadTipoService
    ){}
    @Get()
    async getAll(){
        return await this.especialidadTipoService.getAll();
    }
}
