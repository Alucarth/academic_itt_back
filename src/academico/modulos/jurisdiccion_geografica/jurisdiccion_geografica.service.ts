import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { JurisdiccionGeograficaRepository } from './jurisdiccion_geografica.repository';

@Injectable()
export class JurisdiccionGeograficaService {
    constructor(
      
        @Inject(JurisdiccionGeograficaRepository)
        private jurisdiccionGeograficaRepositorio: JurisdiccionGeograficaRepository,
        private _serviceResp: RespuestaSigedService,

    ){}

    async getAll(){
        return await this.jurisdiccionGeograficaRepositorio.getAll()
    }
    async findJurisdiccionGeografica(id:number){
         const resultado =  await this.jurisdiccionGeograficaRepositorio.getOneById(id);
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
    async findJurisdiccionGeografica2001Codigo(id:number){
         const resultado =  await this.jurisdiccionGeograficaRepositorio.getOne2001ByCodigo(id);


         console.log(resultado);
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
    async findJurisdiccionGeografica2012Codigo(id:number){
         const resultado =  await this.jurisdiccionGeograficaRepositorio.getOne2012ByCodigo(id);


         console.log(resultado);
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

}
