import { Controller, Get } from '@nestjs/common';
import { EducacionTipo } from 'src/academico/entidades/educacionTipo.entity';
import { EducacionTipoService } from './educacion_tipo.service';

@Controller('educacion-tipo')
export class EducacionTipoController {
    constructor (
        private readonly educacionTipoService: EducacionTipoService 
        ){}
        
    @Get()
    async getAll():Promise<EducacionTipo[]>{
        return await this.educacionTipoService.getAll();
    }
    
    @Get('institutos')
    async getAllTipoInstituto():Promise<EducacionTipo[]>{
        return await this.educacionTipoService.getAllTipoInstituto();
    }
}
