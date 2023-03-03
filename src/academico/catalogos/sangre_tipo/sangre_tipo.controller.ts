import { Controller, Get } from '@nestjs/common';
import { SangreTipo } from 'src/academico/entidades/sangreTipo.entity';
import { SangreTipoService } from './sangre_tipo.service';

@Controller('sangre-tipo')
export class SangreTipoController {
    constructor (
        private readonly sangreTipoService: SangreTipoService 
    ){}

    @Get()
    async getAll():Promise<SangreTipo[]>{
        return await this.sangreTipoService.getAll();
    }
}
