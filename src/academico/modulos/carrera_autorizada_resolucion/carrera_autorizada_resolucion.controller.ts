import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { UpdateCarreraAutorizadaResolucionDTO } from './dto/UpdateCarreraAutorizadaResolucionDTO.dto';

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

    @Get('show/:carrera_autorizada_id')
    async show( @Param('carrera_autorizada_id', ParseIntPipe) carrera_autorizada_id:number )
    {
      console.log('show',carrera_autorizada_id)
      return await this.carreraAutorizadaResolucionService.showCareer(carrera_autorizada_id)
    }

    @Put(':/carrera_autorizada_resolucion_id')
    async edit(@Body() dto: UpdateCarreraAutorizadaResolucionDTO,  @Param('carrera_autorizada_resolucion_id', ParseIntPipe) carrera_autorizada_resolucion_id:number)
    {
      //return await this.carreraAutorizadaResolucionService.editResolutionCareer()
    }

    /* para el listado de carreras de la sucursal */
    @Get('career_institute/:institucion_educativa_sucursal_id')
    async getCareerInsitute(@Param('institucion_educativa_sucursal_id', ParseIntPipe) institucion_educativa_sucursal_id:number )
    {
      // return await 
    }
    /*
    @Put(':id')
    async editar( @Body() dto: UpdateCarreraAutorizadaResolucionDto) {
       console.log("update" + dto);
        return await this.carreraAutorizadaResolucionService.update(dto);
    }
    */
}

