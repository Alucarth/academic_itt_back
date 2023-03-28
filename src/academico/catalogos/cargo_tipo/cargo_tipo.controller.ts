import { Controller, Get } from '@nestjs/common';
import { CargoTipo } from 'src/academico/entidades/cargoTipo.entity';
import { CargoTipoService } from './cargo_tipo.service';

@Controller('cargo-tipo')
export class CargoTipoController {

    constructor(
        private readonly cargoTipoService: CargoTipoService
    ){}

    
    @Get()
    async getAll(){
        return await this.cargoTipoService.getAll();
    }


}
