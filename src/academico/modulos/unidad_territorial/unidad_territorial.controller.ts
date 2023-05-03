import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UnidadTerritorial } from 'src/academico/entidades/unidadTerritorial.entity';
import { UnidadTerritorialService } from './unidad_territorial.service';

@ApiTags('unidad-territorial')
@Controller('unidad-territorial')
export class UnidadTerritorialController {
    constructor(
        private readonly unidadTerritorialService: UnidadTerritorialService
    ){}

    @Get()
    async getAll():Promise<UnidadTerritorial[]>{
        return await this.unidadTerritorialService.findUnidadesTerritoriales();
    }

    @Get('/:id')
    async getOneById(@Param('id') id: number):Promise<UnidadTerritorial>{
        return await this.unidadTerritorialService.findUnidadTerritorial(id);
    }

    /*@Get('/:id')
    async generaCodigo(@Param('id') id: number):Promise<UnidadTerritorial>{
        //return await this.unidadTerritorialService.createCodigo(id);
    }*/

    @Get('dependientes/:id')
    async getDependientes(@Param('id') id: number){
        return await this.unidadTerritorialService.findDependientes(id);
    }
    
  

}
