import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource } from 'typeorm';
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';
import { OfertaCurricularService } from './oferta_curricular.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

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
    @Get('byCarreraGestionPeriodoDocente/:id/:gestion/:periodo')
    async getAllAsignaturasByCarreraGestionPeriodoDocente(
        @Param('id') id: number,
        @Param('gestion') gestion: number,
        @Param('periodo') periodo: number){
        return await this.ofertaCurricularService.getAllAsignaturasByCarreraGestionPeriodoDocente(id,gestion,periodo);
    }

    @Auth()
    @Post()
    async createOfertaCurricular(@Body() dto: CreateOfertaCurricularDto[], @Users() user: UserEntity){
     
        return  await this.ofertaCurricularService.crear(dto, user);        
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
