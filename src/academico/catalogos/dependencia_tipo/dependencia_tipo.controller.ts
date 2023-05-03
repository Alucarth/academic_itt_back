import { Controller, Get } from '@nestjs/common';
import { DependenciaTipo } from 'src/academico/entidades/dependenciaTipo.entity';
import { DependenciaTipoService } from './dependencia_tipo.service';

@Controller('dependencia-tipo')
export class DependenciaTipoController {
    constructor (
        private readonly dependenciaTipooService: DependenciaTipoService 
        ){}
        
    @Get()
    async getAll():Promise<DependenciaTipo[]>{
        return await this.dependenciaTipooService.getAll();
    }
}
