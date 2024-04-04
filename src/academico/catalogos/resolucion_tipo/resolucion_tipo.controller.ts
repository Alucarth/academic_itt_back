import { Controller, Get } from '@nestjs/common';
import { ResolucionTipoService } from './resolucion_tipo.service';

@Controller('resolucion-tipo')
export class ResolucionTipoController {
    constructor(
        private readonly resolucionTipoService: ResolucionTipoService
    ){}
    
    /*SE UTILICO PARA AREA DE FORMACION PARA TECNICA, SE PUEDE AGREGAR UNA TABLA DE RELACION ENTRE SISTEMA_TIPO_CAMPO_SABER */
    @Get()
    async getAll(){
        return await this.resolucionTipoService.getAll();
    }

    @Get('list')
    async getList(){
        return await this.resolucionTipoService.getList();
    }
}
