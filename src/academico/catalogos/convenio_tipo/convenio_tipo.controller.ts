import { Controller, Get } from '@nestjs/common';
import { ConvenioTipo } from 'src/academico/entidades/convenioTipo.entity';
import { ConvenioTipoService } from './convenio_tipo.service';

@Controller('convenio-tipo')
export class ConvenioTipoController {
    constructor (
        private readonly convenioTipooService: ConvenioTipoService 
        ){}
        
    @Get()
    async getAll():Promise<ConvenioTipo[]>{
        return await this.convenioTipooService.getAll();
    }
}
   
