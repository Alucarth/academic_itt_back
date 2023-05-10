import { Controller, Get } from '@nestjs/common';
import { AreaTipoService } from './area_tipo.service';

@Controller('area-tipo')
export class AreaTipoController {
    constructor(
        private readonly areaTipoService: AreaTipoService
    ){}
    
    /*SE UTILICO PARA AREA DE FORMACION PARA TECNICA, SE PUEDE AGREGAR UNA TABLA DE RELACION ENTRE SISTEMA_TIPO_CAMPO_SABER */
    @Get()
    async getAll(){
        return await this.areaTipoService.getAll();
    }
}
