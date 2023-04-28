import { Inject, Injectable } from '@nestjs/common';
import { UnidadTerritorialRepository } from './unidad_territorial.repository';

@Injectable()
export class UnidadTerritorialService {
    constructor(
        @Inject(UnidadTerritorialRepository)
        private unidadTerritorialRepositorio: UnidadTerritorialRepository,
    ){}
    
    async findUnidadesTerritoriales(){
        return await this.unidadTerritorialRepositorio.getAll();
    }

    async findUnidadTerritorial(id:number){
        return await this.unidadTerritorialRepositorio.getOneById(id);
    }
    
    
}
