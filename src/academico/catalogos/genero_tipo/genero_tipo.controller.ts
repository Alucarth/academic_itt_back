import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GeneroTipo } from 'src/academico/entidades/generoTipo.entity';
import { GeneroTipoService } from './genero_tipo.service';

@ApiTags('genero-tipo')
@Controller('genero-tipo')
export class GeneroTipoController {
    constructor (
        private readonly generoTipoService: GeneroTipoService 
    ){}

    @Get()
    async getAll():Promise<GeneroTipo[]>{
        return await this.generoTipoService.getAll();
    }
}
