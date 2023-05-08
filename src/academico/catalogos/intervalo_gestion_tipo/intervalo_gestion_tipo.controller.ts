import { Controller, Get } from '@nestjs/common';
import { IntervaloGestionTipoService } from './intervalo_gestion_tipo.service';

@Controller('intervalo-gestion-tipo')
export class IntervaloGestionTipoController {
    constructor(
        private readonly intervaloGestionTipoService: IntervaloGestionTipoService
    ){}
    @Get('itt')
    async getAll(){
        return await this.intervaloGestionTipoService.getAllItt();
    }
}
