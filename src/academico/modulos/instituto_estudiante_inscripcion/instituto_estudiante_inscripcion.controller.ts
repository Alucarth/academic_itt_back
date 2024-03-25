import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InstitutoEstudianteInscripcionService } from "./instituto_estudiante_inscripcion.service";


ApiTags('Instituto Estudiante Inscripcion Archivo')
@Controller('instituto-estudiante-inscripcion')
export class InstitutoEstudianteInscripcionController{
    constructor(private readonly institutoEstudianteInscripcionArchivoService: InstitutoEstudianteInscripcionService){}

    @Get(':instituto_estudiante_inscripcion_id')
    async getInscription(
        @Param('instituto_estudiante_inscripcion_id') instituto_estudiante_inscripcion_id: number
    ){
        // return await this.institutoEstudianteInscripcionArchivoService
    }
    
    @Get('list/:inscripcion_tipo_id/:estado_instituto_id')
    async getListByInscriptionType(
        @Param('inscripcion_tipo_id') inscripcion_tipo_id: number,
        @Param('estado_instituto_id') estado_instituto_id: number
        
        )
    {
        
        return await this.institutoEstudianteInscripcionArchivoService.getInscriptions(inscripcion_tipo_id,estado_instituto_id)
    }

}