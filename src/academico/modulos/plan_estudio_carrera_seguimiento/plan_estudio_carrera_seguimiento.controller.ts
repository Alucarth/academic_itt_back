import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlanEstudioCarreraSeguimientoService } from './plan_estudio_carrera_seguimiento.service';

import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { CreateSeguimientoDto } from './dto/createSeguimiento.dto';

@Controller('plan-estudio-carrera-seguimiento')
export class PlanEstudioCarreraSeguimientoController {
    constructor(
        private readonly planEstudioCarreraSeguimientoService: PlanEstudioCarreraSeguimientoService
    ){}

    @Get()
    async getPlanCarreraSeguimientos(){
       return await this.planEstudioCarreraSeguimientoService.getAll();
    }
   
    @Auth()
    @Post()
    async create(@Body() createSeguimientoDto: CreateSeguimientoDto, @Users() user: UserEntity) {
      return await this.planEstudioCarreraSeguimientoService.create(createSeguimientoDto, user);
    }

    @Get('procesos/:id')
    async getProcesosPlanCarreraSeguimientos(
        @Param('id', ParseIntPipe) id: number, 
    ){
       return await this.planEstudioCarreraSeguimientoService.getAllProcesosCarrera(id);
    }

}
