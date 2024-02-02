import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';
import { OfertaCurricularService } from './oferta_curricular.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';

@Controller('oferta-curricular')
export class OfertaCurricularController {
    constructor (
        private readonly ofertaCurricularService: OfertaCurricularService,
       
        ){}

    @Get()
    async getAllBy(){
        return await this.ofertaCurricularService.getAll();
    }
    @Get('carrera/:id')
    async getAllByCarrera(@Param('id') id: number){
        return await this.ofertaCurricularService.getAllByCarreraId(id);
    }

    @Get('byCarreraGestionPeriodo/:id/:gestion/:periodo')
    async getAllAsignaturasByCarreraGestionPeriodo(
        @Param('id') id: number,
        @Param('gestion') gestion: number,
        @Param('periodo') periodo: number){
        return await this.ofertaCurricularService.getAllAsignaturasByCarreraGestionPeriodo(id,gestion,periodo);
    }
    /** show academic offert by periodo */
    @Get('byCarreraGestionPeriodoDocente/:id/:gestion/:periodo')
    async getAllAsignaturasByCarreraGestionPeriodoDocente(
        @Param('id') id: number,
        @Param('gestion') gestion: number,
        @Param('periodo') periodo: number){
        return await this.ofertaCurricularService.getAllAsignaturasByCarreraGestionPeriodoDocente(id,gestion,periodo);
    }


    @Get('byCarreraGestionPeriodoRegimenGrado/:id/:gestion/:periodo/:regimen_grado')
    async getAllAsignaturasByRegimenGrado(
        @Param('id') id: number,
        @Param('gestion') gestion: number,
        @Param('periodo') periodo: number,
        @Param('regimen_grado') regimen_grado: number){
        return await this.ofertaCurricularService.getAllAsignaturasByRegimenGrado(id,gestion,periodo,regimen_grado);
    }



    @Auth()
    @Post()
    async createOfertaCurricular(@Body() dto: CreateOfertaCurricularDto[], @Users() user: UserEntity){
     
        return  await this.ofertaCurricularService.crear(dto, user);        
    }

    @Get('getRegimenEstudio/:instituto_plan_estudio_carrera_id')
    async getRegimenEstudio( @Param('instituto_plan_estudio_carrera_id') instituto_plan_estudio_carrera_id: number){
        return this.ofertaCurricularService.getRegimenEstudio(instituto_plan_estudio_carrera_id)
    }

    @Get('getParalelos/:instituto_plan_estudio_carrera_id/:regimen_grado_tipo_id/:gestion_tipo_id')
    async getParalelosOfertaCurricular(
        @Param('instituto_plan_estudio_carrera_id') instituto_plan_estudio_carrera_id: number,
        @Param('regimen_grado_tipo_id') regimen_grado_tipo_id: number,
        @Param('gestion_tipo_id') gestion_tipo_id: number,)
    {
        return this.ofertaCurricularService.getParalelosOfertaCurricular(instituto_plan_estudio_carrera_id, regimen_grado_tipo_id,gestion_tipo_id)
    }
    

    @Post('editar')
    async EditarOferta(@Body() request: any)
    {
        // console.log('entrando a request',request)
        // let respuesta = 'enviando respouestas'
        return this.ofertaCurricularService.editar(request)
    }


    @Delete("/:id")
    async deleteResolucion(@Param("id") id: string) {
      return await this.ofertaCurricularService.deleteOferta(parseInt(id));
    }
    
}
