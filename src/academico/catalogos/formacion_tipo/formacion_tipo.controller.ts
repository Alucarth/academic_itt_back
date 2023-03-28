import { Controller, Get } from '@nestjs/common';
import { FormacionTipo } from 'src/academico/entidades/formacionTipo.entity';
import { FormacionTipoService } from './formacion_tipo.service';

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
