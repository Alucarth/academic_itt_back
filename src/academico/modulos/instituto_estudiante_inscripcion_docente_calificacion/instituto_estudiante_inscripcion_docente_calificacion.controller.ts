import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateInstitutoInscripcionDocenteCalificacionDto } from './dto/createInstitutoInscripcionDocenteCalificacion.dto';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { ApiTags } from '@nestjs/swagger';
import { MasiveCreateTeacherCalification } from './dto/masiveCreateTeacherCalification.dto';

ApiTags('Inscripciones')
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

    // @Get('record-signature/:aula_id/:carrera_autorizada_id')
    // async registroNotaByAulaId(@Param('aula_id') aula_id: number,@Param('carrera_autorizada_id') carrera_autorizada_id: number)
    // {
    //     console.log('ingresando a record signature')
    //     return await this.inscripcionDocenteCalificacionService.registroNotaByAulaId(aula_id, carrera_autorizada_id);
    // }

    @Get('record-signature/:aula_id/:carrera_autorizada_id/:periodo_tipo_id')
    async registroYearNotaByAulaId(@Param('aula_id') aula_id: number,@Param('carrera_autorizada_id') carrera_autorizada_id: number, @Param('periodo_tipo_id') periodo_tipo_id: number)
    {
        console.log('ingresando a record signature')
        // if(periodo_tipo_id>0)
        // {
        //     return await this.inscripcionDocenteCalificacionService.registroYearNotaByAulaId(aula_id, carrera_autorizada_id, periodo_tipo_id);
        // }else{
            return await this.inscripcionDocenteCalificacionService.registroNotaByAulaId(aula_id, carrera_autorizada_id);
        // }
    }

    // @Get('aula-fixes/:aula_id/:modalidad_evaluacion_tipo_id')
    // async auulaFixes(@Param('aula_id') aula_id: number,@Param('modalidad_evaluacion_tipo_id') modalidad_evaluacion_tipo_id: number)
    // {
    //     console.log('ingresando a aula fixes')
    //     return await this.inscripcionDocenteCalificacionService.aulaFixes(aula_id, modalidad_evaluacion_tipo_id);
    // }
    
    // @Get('aula-fixes')
    // async auulaFixesAll(@Param('aula_id') aula_id: number,@Param('modalidad_evaluacion_tipo_id') modalidad_evaluacion_tipo_id: number)
    // {
    //     console.log('ingresando a aula fixes')
    //     return await this.inscripcionDocenteCalificacionService.aulaFixesAll();
    // }

    @Auth()
    @Post('save-notes')
    async saveNotes(@Body() students: MasiveCreateTeacherCalification[], @Users() user: UserEntity)
    {
        console.log('save notes --------------------------------------------> ')
        return await this.inscripcionDocenteCalificacionService.saveNotes(students, user)
    }

    @Post('student-notes')
    async studentNotes(@Body() payload: any)
    {
        return await this.inscripcionDocenteCalificacionService.studentNotes(payload)
    }

    
    @Auth()
    @Post('save-notes-homologation')
    async saveNotesHomologation(@Body() payload: any[], @Users() user: UserEntity)
    {
        console.log('save notes homologation ---> ')
        return await this.inscripcionDocenteCalificacionService.saveNotesHomologation(payload, user)
    }

    
}
