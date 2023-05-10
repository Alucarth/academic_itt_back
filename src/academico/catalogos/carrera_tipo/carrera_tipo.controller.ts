import { Controller, Get } from '@nestjs/common';
import { CarreraTipoService } from './carrera_tipo.service';

@Controller('carrera-tipo')
export class CarreraTipoController {
    constructor(
        private readonly carreraTipoService: CarreraTipoService
    ){}
    
    /*SE UTILICO PARA AREA DE FORMACION PARA TECNICA, SE PUEDE AGREGAR UNA TABLA DE RELACION ENTRE SISTEMA_TIPO_CAMPO_SABER */
    @Get()
    async getAll(){
        return await this.carreraTipoService.getAll();
    }
}
