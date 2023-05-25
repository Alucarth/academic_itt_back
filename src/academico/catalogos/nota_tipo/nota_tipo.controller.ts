import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { NotaTipoService } from './nota_tipo.service';

@Controller('nota-tipo')
export class NotaTipoController {
    constructor (
        private readonly notaTipoService: NotaTipoService 
        ){}

    @Get()
    async getAll(){
        return await this.notaTipoService.getAll();
    }
    @Get(':id')
    async getById(@Param("id", ParseIntPipe) id: number){
        return await this.notaTipoService.getById(id);
    }
}
