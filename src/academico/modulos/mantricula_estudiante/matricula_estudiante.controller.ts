import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MatriculaEstudianteService } from './matricula_estudiante.service';


@ApiTags('Matricula Estudiante')
@Controller('matricula-estudiante')
export class MatriculaEstudianteController {
    constructor(private readonly matriculaEstudianteService: MatriculaEstudianteService){}

    @Get('list/:estado_instituto_id')
    async getList(
        @Param("estado_instituto_id") estado_instituto_id: number  
    ){
        return await this.matriculaEstudianteService.getList(estado_instituto_id)
    }

    @Get(':matricula_estudiante_id')
    async getMatriculaEstudiante(
        @Param("matricula_estudiante_id") matricula_estudiante_id: number  
    ){
        return await this.matriculaEstudianteService.getMatriculaEstudiante(matricula_estudiante_id)
    }

    //TODO: aqui colocar registro de historial y archivos de la matricula 
    //TODO: Falta  
}