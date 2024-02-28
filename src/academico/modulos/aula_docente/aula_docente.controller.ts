import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AulaDocenteService } from './aula_docente.service';
import { CreateAulaDocenteDto } from './dto/createAulaDocente.dto';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
@Controller('aula-docente')
export class AulaDocenteController {
    constructor (
        private readonly aulaDocenteService: AulaDocenteService,
        ){}

    @Get()
    async getAllBy(){
        return await this.aulaDocenteService.getAll();
    }

    @Get('carrerasByDocenteId/:id')
    async getAllCarrerasByDocente(@Param("id", ParseIntPipe) id: number){
        return await this.aulaDocenteService.getCarrerasByDocenteId(id);
    }
    @Get('carreras-persona/:id')
    async getAllCarrerasByPersona(@Param("id", ParseIntPipe) id: number){
        return await this.aulaDocenteService.getCarrerasByPersonaId(id);
    }
    
    @Get('carreras-aulas-persona/:id')
    async getAllCarrerasAulasByPersona(@Param("id", ParseIntPipe) id: number){
        return await this.aulaDocenteService.getCarrerasDocentesAulasByPersonaId(id);
    }

    @Auth()
    @Post()
    async createOfertaCurricular(@Body() dto: CreateAulaDocenteDto[], @Users() user: UserEntity){
        return  await this.aulaDocenteService.crearAulaDocente(dto, user);        
    }

    @Get('gestions_by_teacher/:persona_id/:institucion_educativa_sucursal_id')
    async getGestionsByteachers(@Param("persona_id", ParseIntPipe) persona_id: number, @Param("institucion_educativa_sucursal_id", ParseIntPipe) institucion_educativa_sucursal_id: number)
    {
        return await this.aulaDocenteService.getGestionsByTeacher(persona_id,institucion_educativa_sucursal_id )
    }

    @Post('resolutions_by_teacher')
    async getResolutionsByTeacher(@Body() payload: any)
    {
        console.log('payload', payload)
        return await this.aulaDocenteService.getResolutionsByTeacher(payload)
    }

    @Post('subjects_by_teacher')
    async getSubjectsByTeacher(@Body() payload: any)
    {
        console.log('payload', payload)
        return await this.aulaDocenteService.getSubjectsByTeacher(payload)
    }

    
}
