import { Controller, Get } from '@nestjs/common';
import { AulaDetalleService } from './aula_detalle.service';

@Controller('aula-detalle')
export class AulaDetalleController {
    constructor (
        private readonly aulaDetalleService: AulaDetalleService,
        
        ){}

    @Get()
    async getAllBy(){
        return await this.aulaDetalleService.getAll();
    }
    
}
