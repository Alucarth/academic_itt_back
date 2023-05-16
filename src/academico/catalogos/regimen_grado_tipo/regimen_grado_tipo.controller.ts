import { Controller, Get, Param } from '@nestjs/common';
import { RegimenGradoTipoService } from './regimen_grado_tipo.service';

@Controller('regimen-grado-tipo')
export class RegimenGradoTipoController {
    constructor(
        private readonly regimenGradoTipoService: RegimenGradoTipoService
    ){}

    
    @Get()
    async getAll(){
        return await this.regimenGradoTipoService.getAll();
    }
    @Get('/:regimen')
    async getByRegimen(@Param("regimen") regimen: string){
        return await this.regimenGradoTipoService.getByRegimen(regimen);
    }
}
