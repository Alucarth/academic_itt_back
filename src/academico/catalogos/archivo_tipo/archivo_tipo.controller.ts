import { Controller, Get } from "@nestjs/common";
import { ArchivoTipoService } from "./archivo_tipo.service";
import { ArchivoTipo } from "src/academico/entidades/archivoTipo.entity";

@Controller('archivo-tipo')
export class ArchivoTipoController {
    constructor( private readonly archivoTipoService: ArchivoTipoService){ }

    @Get()
    async getAll(): Promise<ArchivoTipo[]> {
        return await this.archivoTipoService.getAll()
    }

    @Get('transitability')
    async getTransitability()
    {
        return await this.archivoTipoService.getTypeTransitability()
    }

    @Get('homologation') 
    async getHomologation()
    {
        return await this.archivoTipoService.getTypeHomologation()
    }
}