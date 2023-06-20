import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
import { UpdateCarreraAutorizadaResolucionDto } from './dto/updateCarreraAutorizadaResolucion.dto';

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
    /*
    @Put(':id')
    async editar( @Body() dto: UpdateCarreraAutorizadaResolucionDto) {
       console.log("update" + dto);
        return await this.carreraAutorizadaResolucionService.update(dto);
    }
    */
}

