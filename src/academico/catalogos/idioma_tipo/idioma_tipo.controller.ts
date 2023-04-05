import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IdiomaTipo } from 'src/academico/entidades/idiomaTipo.entity';
import { IdiomaTipoService } from './idioma_tipo.service';

@ApiTags('idioma-tipo')
@Controller('idioma-tipo')
export class IdiomaTipoController {
    constructor (
        private readonly idiomaTipoService: IdiomaTipoService 
    ){}

    @Get()
    async getAll():Promise<IdiomaTipo[]>{
        return await this.idiomaTipoService.getAll();
    }
}

