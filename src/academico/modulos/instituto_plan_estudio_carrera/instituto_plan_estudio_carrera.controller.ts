import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';
import { InstitutoPlanEstudioCarreraService } from './instituto_plan_estudio_carrera.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

@Controller('instituto-plan-estudio-carrera')
export class InstitutoPlanEstudioCarreraController {
    constructor(
        private readonly institutoPlanEstudioCarreraService: InstitutoPlanEstudioCarreraService
    ){}

    @Get()
    async getAllIttSucursales(){
        return await this.institutoPlanEstudioCarreraService.getAll();
    }
    @Get('carrera/:id')
    async getResolucionesCarreraAutorizadaById(@Param('id', ParseIntPipe) id: number){
        return await this.institutoPlanEstudioCarreraService.getResolucionesCarreraAutorizadaId(id);
        // return await this.institutoPlanEstudioCarreraService.getResolutionsCareer(id) //revisar no esta en el formato deseado
    }
    
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number){
        return await this.institutoPlanEstudioCarreraService.getPlanAsignaturaById(id);
    }
    @Get('id/:id')
    async getOneById(@Param('id', ParseIntPipe) id: number){
        
        return await this.institutoPlanEstudioCarreraService.getOneById(id);
    }

    @Get('grados/:id')
    async getGradosByPlanId(
        @Param('id', ParseIntPipe) id: number
    ){
        return await this.institutoPlanEstudioCarreraService.getGradosById(id);
    }
    @Get('asignaturas-grado/:id/:grado')
    async getAsignaturasGradosByPlanId(
        @Param('id', ParseIntPipe) id: number,
        @Param('grado', ParseIntPipe) grado: number  
    ){
        return await this.institutoPlanEstudioCarreraService.getAsignaturasGradosById(id, grado);
    }

    @Auth()
    @Post()
    async createCurso(@Body() dto: CreateInstitutoPlanEstudioCarreraDto, @Users() user: UserEntity){
        console.log('controller insert',dto);
        return  await this.institutoPlanEstudioCarreraService.createInstitutoPlan(dto, user);        
    }
}
