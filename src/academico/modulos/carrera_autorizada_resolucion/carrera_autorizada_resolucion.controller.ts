import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

@Controller('carrera-autorizada-resolucion')

export class CarreraAutorizadaResolucionController {
    constructor(private readonly carreraAutorizadaResolucionService: CarreraAutorizadaResolucionService) {}
    
    @Get(":id")
    async getById(
      @Param("id", ParseIntPipe) id: number
    ) {
      return await this.carreraAutorizadaResolucionService.getOneById(id);
    }

    @Auth()
    @Post()
    async crear( @Body() dto: CreateCarreraAutorizadaResolucionDto, @Users() user: UserEntity) {
       console.log("crear" + dto);
        return await this.carreraAutorizadaResolucionService.crear(dto, user);
       
    }
    /*
    @Put(':id')
    async editar( @Body() dto: UpdateCarreraAutorizadaResolucionDto) {
       console.log("update" + dto);
        return await this.carreraAutorizadaResolucionService.update(dto);
    }
    */
}

