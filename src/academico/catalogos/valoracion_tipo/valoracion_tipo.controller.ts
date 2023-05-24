import { Controller, Get } from '@nestjs/common';
import { ValoracionTipoService } from './valoracion_tipo.service';

@Controller('valoracion-tipo')
export class ValoracionTipoController {
    constructor (
        private readonly valoracionTipoService: ValoracionTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.valoracionTipoService.getAll();
    }
}
