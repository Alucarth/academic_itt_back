import { Controller, Get } from '@nestjs/common';
import { SegipTipo } from 'src/academico/entidades/segipTipo.entity';
import { SegipTipoService } from './segip_tipo.service';

@Controller('segip-tipo')
export class SegipTipoController {
    constructor (
        private readonly segipTipoService: SegipTipoService 
    ){}

    @Get()
    async getAll():Promise<SegipTipo[]>{
        return await this.segipTipoService.getAll();
    }
}
