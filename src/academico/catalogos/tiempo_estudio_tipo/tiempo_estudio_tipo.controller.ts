import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TiempoEstudioTipoService } from './tiempo_estudio_tipo.service';

@Controller('tiempo-estudio-tipo')
@ApiTags('tiempo-estudio-tipo')
export class TiempoEstudioTipoController {
    constructor(
        private readonly tiempoEstudioTipoService: TiempoEstudioTipoService
    ){}
    @Get('itt/:regimen/:nivel')
    async getAll(@Param('regimen') regimen: number, @Param('nivel') nivel: number){
        return await this.tiempoEstudioTipoService.getAllItt(regimen, nivel);
    }
}
