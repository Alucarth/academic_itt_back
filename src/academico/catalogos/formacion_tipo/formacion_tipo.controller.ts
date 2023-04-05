import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FormacionTipo } from 'src/academico/entidades/formacionTipo.entity';
import { FormacionTipoService } from './formacion_tipo.service';

@ApiTags('formacion-tipo')
@Controller('formacion-tipo')
export class FormacionTipoController {

    constructor(
        private readonly formacionTipoService: FormacionTipoService
    ){}

    
    @Get()
    async getAll(){
        return await this.formacionTipoService.getAll();
    }


}
