import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CargoTipo } from 'src/academico/entidades/cargoTipo.entity';
import { CargoTipoService } from './cargo_tipo.service';

@ApiTags('cargo-tipo')
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
