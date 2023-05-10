import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

@Controller('carrera-autorizada')
export class CarreraAutorizadaController {
    constructor(private readonly carreraAutorizadaService: CarreraAutorizadaService) {}

  @Get(":id")
  async getById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CarreraAutorizada> {
    return await this.carreraAutorizadaService.getById(id);
  }

  @Get("sucursal/:id")
  async getAllCarrerasBySie(@Param("id", ParseIntPipe) id: number) {
    
    return await this.carreraAutorizadaService.getCarrerasBySie(id);
  }
}
