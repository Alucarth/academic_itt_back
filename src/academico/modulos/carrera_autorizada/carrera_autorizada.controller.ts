import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

@Controller('carrera-autorizada')
export class CarreraAutorizadaController {
    constructor(private readonly carreraAutorizadaService: CarreraAutorizadaService) {}
    
    @Get("sucursal/:id")
    async getCarrerasBySucursalId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasBySucursalId(id);
    }
    @Get("ie/:id")
    async getCarrerasByIeId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasByIeId(id);
    }
    @Get(":id")
    async getCarreraById(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarreraById(id);
    }

}
