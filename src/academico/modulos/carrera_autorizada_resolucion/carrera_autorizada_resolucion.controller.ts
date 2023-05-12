import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';

@Controller('carrera-autorizada-resolucion')

export class CarreraAutorizadaResolucionController {
    constructor(private readonly carreraAutorizadaResolucionService: CarreraAutorizadaResolucionService) {}
    
    @Get(":id")
    async getById(
      @Param("id", ParseIntPipe) id: number
    ) {
      return await this.carreraAutorizadaResolucionService.getOneById(id);
    }

     //create carrera_autorizada_resolucion
   // @UseGuards(JwtAuthGuard, CasbinGuard)
    @Post()
    async crear( @Body() dto: CreateCarreraAutorizadaResolucionDto) {
       console.log("crear" + dto);
        return await this.carreraAutorizadaResolucionService.crear(dto);
       
    }

}
