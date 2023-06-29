import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { UnidadTerritorialRepository } from './unidad_territorial.repository';

@Injectable()
export class UnidadTerritorialService {
    constructor(
        @Inject(UnidadTerritorialRepository)
        private unidadTerritorialRepositorio: UnidadTerritorialRepository,
        private _serviceResp: RespuestaSigedService,
    ){}
    
    async findUnidadesTerritoriales(){
        return await this.unidadTerritorialRepositorio.getAll();
    }

    async findUnidadTerritorial(id:number){
        return await this.unidadTerritorialRepositorio.getOneById(id);
    }

    async findDependientes(id:number){
        const resultado =  await this.unidadTerritorialRepositorio.getDependientes(id);
       if(resultado == null){
           return this._serviceResp.respuestaHttp404(
               '',
               'No se encontraron resultados  !!',
               '',
           );
       }
       return this._serviceResp.respuestaHttp201(
           resultado,
           'Datos encontrados  !!',
           '',
       );
   }
    async findDepartamentos(){
        const resultado =  await this.unidadTerritorialRepositorio.getDepartamentos();
        return resultado;
   }
    
    
}
