import { Controller, Get } from '@nestjs/common';
import { NivelAcademicoTipoService } from './nivel_academico_tipo.service';

@Controller('nivel-academico-tipo')
export class NivelAcademicoTipoController {
    constructor(
        private readonly nivelAcademicoTipoService: NivelAcademicoTipoService
    ){}
    @Get('itt')
    async getAll(){
        return await this.nivelAcademicoTipoService.getAllItt();
    }
    @Get('cursos')
    async getAllCursos(){
        return await this.nivelAcademicoTipoService.getAllCursosItt();
    }
}
