import { Controller, Get } from '@nestjs/common';
import { DiaTipoService } from './dia_tipo.service';

@Controller('dia-tipo')
export class DiaTipoController {
    constructor (
        private readonly diaTipoService: DiaTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.diaTipoService.getAll();
    }
}
