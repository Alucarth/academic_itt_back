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

    @Get('years')
    async getYears(){
        return await this.regimenGradoTipoService.findByRegimenGrado('AÑO');
    }

    @Get('semesters')
    async getSemester(){
        return await this.regimenGradoTipoService.findByRegimenGrado('SEMESTRE')
    }
    
    @Get('/:regimen')
    async getByRegimen(@Param("regimen") regimen: string){
        return await this.regimenGradoTipoService.getByRegimen(regimen);
    }  
}
