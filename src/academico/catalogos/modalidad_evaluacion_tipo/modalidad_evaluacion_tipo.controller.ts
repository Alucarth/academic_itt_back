import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ModalidadEvaluacionTipoService } from './modalidad_evaluacion_tipo.service';

@Controller('modalidad-evaluacion-tipo')
export class ModalidadEvaluacionTipoController {
    constructor (
        private readonly modalidadEvaluacionTipoService: ModalidadEvaluacionTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.modalidadEvaluacionTipoService.getAll();
    }
    @Get('regimen/:id')
    async getAllByRegimen(@Param('id', ParseIntPipe) id: number){
        return await this.modalidadEvaluacionTipoService.getAllByRegimen(id);
    }
}
