import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GestionTipo } from 'src/academico/entidades/gestionTipo.entity';
import { GestionTipoService } from './gestion_tipo.service';

@Controller('gestion-tipo')
@ApiTags('gestion-tipo')
export class GestionTipoController {

    constructor (
        private readonly gestionTipoService: GestionTipoService
    ){}

    @Get()
    async getById():Promise<GestionTipo[]>{
        return await this.gestionTipoService.getAll();
    }

    @Get('vigente')
    async getGestionVigente():Promise<GestionTipo>{
        return await this.gestionTipoService.getGestionVigente();
    }
    

   
}
