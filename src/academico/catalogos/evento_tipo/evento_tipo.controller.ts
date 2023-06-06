import { Controller, Get } from '@nestjs/common';
import { EventoTipoService } from './evento_tipo.service';

@Controller('evento-tipo')
export class EventoTipoController {
    constructor (
        private readonly eventoTipoService: EventoTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.eventoTipoService.getAll();
    }
}
