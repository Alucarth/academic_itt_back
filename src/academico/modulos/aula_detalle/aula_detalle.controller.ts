import { Controller, Delete, Get, Param } from '@nestjs/common';
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
    @Delete("/:id")
    async deleteDetalle(@Param("id") id: string) {
      return await this.aulaDetalleService.deleteDetalle(parseInt(id));
    }
    
}
