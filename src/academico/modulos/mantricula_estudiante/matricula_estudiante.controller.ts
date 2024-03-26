import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MatriculaEstudianteService } from './matricula_estudiante.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { User } from "src/users/entity/users.entity";
import { Users } from "src/users/decorator/user.decorator";


@ApiTags('Matricula Estudiante')
@Controller('matricula-estudiante')
export class MatriculaEstudianteController {
    constructor(private readonly matriculaEstudianteService: MatriculaEstudianteService){}

    @Get('list/:estado_instituto_id/:departamento_id')
    async getList(
        @Param("estado_instituto_id") estado_instituto_id: number,
        @Param("departamento_id") departamento_id: number    
    ){
        return await this.matriculaEstudianteService.getList(estado_instituto_id, departamento_id)
    }

    @Get(':matricula_estudiante_id')
    async getMatriculaEstudiante(
        @Param("matricula_estudiante_id") matricula_estudiante_id: number  
    ){
        return await this.matriculaEstudianteService.getMatriculaEstudiante(matricula_estudiante_id)
    }

    @Auth()
    @Post('send-dde')
    async sendDDE ( @Body() payload: any, @Users() user: User ){

        console.log('payload -------->',payload)
        return await this.matriculaEstudianteService.sendDDE(payload.matricula_estudiante_id, payload.files, user)
    }
    //TODO: aqui colocar registro de historial y archivos de la matricula 
    //TODO: Falta  
}