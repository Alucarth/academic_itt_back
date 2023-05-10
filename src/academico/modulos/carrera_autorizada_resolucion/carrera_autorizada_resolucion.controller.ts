import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';

@Controller('carrera-autorizada-resolucion')
export class CarreraAutorizadaResolucionController {
    constructor(private readonly carreraAutorizadaResolucionService: CarreraAutorizadaResolucionService) {}
    
    @Get(":id")
    async getById(
      @Param("id", ParseIntPipe) id: number
    ): Promise<CarreraAutorizadaResolucion> {
      return await this.carreraAutorizadaResolucionService.getById(id);
    }
}
