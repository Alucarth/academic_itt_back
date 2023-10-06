import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EstadoInsitutoService } from "./estado_instituto.service";
import { EstadoInstituto } from "src/academico/entidades/estadoInstituto.entity";

@ApiTags('estado-instituto')
@Controller('estado-instituto')
export class EstadoInstitutoController {
    constructor (
        private readonly estadoInsitutoService: EstadoInsitutoService
    ){}

    @Get()
    async getAll(): Promise<EstadoInstituto[]>{
        return await this.estadoInsitutoService.getAll()
    }
}