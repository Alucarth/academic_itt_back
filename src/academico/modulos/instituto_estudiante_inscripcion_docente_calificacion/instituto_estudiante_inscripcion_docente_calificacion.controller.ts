import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

@Controller('instituto-estudiante-inscripcion-docente-calificacion')
export class InstitutoEstudianteInscripcionDocenteCalificacionController {
    constructor (
        private readonly inscripcionDocenteCalificacionService: InstitutoEstudianteInscripcionDocenteCalificacionService,
        ){}

    @Get()
    async getAllBy(){
        return await this.inscripcionDocenteCalificacionService.getAll();
    }
    @Get('aula/:id')
    async getAllCalificacionesByAulaId(@Param('id') id: number,){
        return await this.inscripcionDocenteCalificacionService.getAllCalificacionesByAulaId(id);
    }
    @Get('inscripcion/:id')
    async getAllCalificacionesByInscripcionId(@Param('id') id: number,){
        return await this.inscripcionDocenteCalificacionService.getAllCalificacionesByInscripcionId(id);
    }
    @Get('inscripcion-modalidad/:id/:modalidad')
    async getAllCalificacionesByInscripcionModalidadId(@Param('id') id: number,@Param('modalidad') modalidad: number){
        return await this.inscripcionDocenteCalificacionService.getAllCalificacionesByInscripcionModalidadId(id, modalidad);
    }

    @Auth()
    @Get('promedios/aula-periodo/:id/:periodo')
    async getAllPromedioCalificacionByAulaId(@Param('id') id: number, @Param('periodo') periodo: number, @Users() user: UserEntity){
        return await this.inscripcionDocenteCalificacionService.createUpdatePromedioCalificacionByAulaId(id, periodo,0, user);
    }
    @Get('estados-finales/aula/:id')
    async getAllEstadosFinalesByAulaId(@Param('id') id: number){
        return await this.inscripcionDocenteCalificacionService.updateEstadosFinalesByAulaId(id);
    }
    @Auth()
    @Post()
    async insertDocenteCalificacionGlobal(@Body() dto: CreateInstitutoInscripcionDocenteCalificacionDto[], @Users() user: UserEntity){
        return  await this.inscripcionDocenteCalificacionService.crearInscripcionDocenteCalificacionGlobal(dto, user);        
    }
    
}
