import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

@Controller('carrera-autorizada')
export class CarreraAutorizadaController {
    constructor(private readonly carreraAutorizadaService: CarreraAutorizadaService) {}
    
    @Get("sucursal/:id")
    async getCarrerasBySucursalId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasBySucursalId(id);
    }

}
