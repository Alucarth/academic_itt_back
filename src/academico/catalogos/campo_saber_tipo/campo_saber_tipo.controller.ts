import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CampoSaberTipoService } from './campo_saber_tipo.service';

@ApiTags('campo-saber-tipo')
@Controller('campo-saber-tipo')
export class CampoSaberTipoController {
    constructor(
        private readonly campoSaberTipoService: CampoSaberTipoService
    ){}
    
    /*SE UTILICO PARA AREA DE FORMACION PARA TECNICA, SE PUEDE AGREGAR UNA TABLA DE RELACION ENTRE SISTEMA_TIPO_CAMPO_SABER */
    @Get('itt')
    async getAll(){
        return await this.campoSaberTipoService.getAllItt();
    }

}
