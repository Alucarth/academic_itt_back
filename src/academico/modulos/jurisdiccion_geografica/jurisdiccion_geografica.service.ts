import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { UnidadTerritorialRepository } from '../unidad_territorial/unidad_territorial.repository';
import { CreateJurisdiccionGeograficaDto } from './dto/createJurisdiccionGeografica.dto';
import { UpdateJurisdiccionGeograficaDto } from './dto/updateJurisdiccionGeografica.dto';
import { JurisdiccionGeograficaRepository } from './jurisdiccion_geografica.repository';

@Injectable()
export class JurisdiccionGeograficaService {
    constructor(
      
        @Inject(JurisdiccionGeograficaRepository)
        private jurisdiccionGeograficaRepositorio: JurisdiccionGeograficaRepository,
        @Inject(UnidadTerritorialRepository)
        private unidadTerritorialRepositorio: UnidadTerritorialRepository,

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

    async findJurisdiccionGeograficaByCodigo(id:number){
         const resultado =  await this.jurisdiccionGeograficaRepositorio.getOneByCodigo(id);
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
    
    async generateCodigo(municipio,provincia,departamento){
        const codigo =  await this.jurisdiccionGeograficaRepositorio.getCodigo(municipio, provincia, departamento);
        return codigo;
   }

    async createJurisdiccionGeografica (dto: CreateJurisdiccionGeograficaDto) {

        const lugar = await this.unidadTerritorialRepositorio.getDependientes(dto.localidadUnidadTerritorial2001Id);
        let municipio =  lugar.unidadTerritorialPadre.unidadTerritorialPadre.codigo;
        let provincia =  lugar.unidadTerritorialPadre.unidadTerritorialPadre.unidadTerritorialPadre.codigo;
        let departamento =  lugar.unidadTerritorialPadre.unidadTerritorialPadre.unidadTerritorialPadre.unidadTerritorialPadre.codigo;

        const codigo =  await this.generateCodigo(municipio, provincia, departamento);
        
       
            const op = async (transaction: EntityManager) => {
              dto.codigo = codigo;
              const nuevaJurisdiccionGeografica =  await this.jurisdiccionGeograficaRepositorio.createJurisdiccionGeografica(
                dto,
                transaction
              );
              return nuevaJurisdiccionGeografica;
            }
  
            const crearResult = await this.jurisdiccionGeograficaRepositorio.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult.id,
                  'Registro de jurisdiccionGeograficacurso Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
    }
    async updateJurisdiccionGeografica (id:number, dto: UpdateJurisdiccionGeograficaDto) {

        const jurisdiccion = await this.findJurisdiccionGeograficaByCodigo(id);
       // const jurisdiccion = await this.findJurisdiccionGeografica(id);
      
        if(jurisdiccion.data){
            const op = async (transaction: EntityManager) => {
                const editJurisdiccionGeografica =  await this.jurisdiccionGeograficaRepositorio.updateJurisdiccionGeografica(
                  id,
                  dto,
                  transaction
                );
                return editJurisdiccionGeografica;
              }
    
              const editResult = await this.jurisdiccionGeograficaRepositorio.runTransaction(op)
    
              if(editResult){
                return this._serviceResp.respuestaHttp201(
                    editResult,
                    'Actualizacion de Jurisdiccion Geografica realizado !!',
                    '',
                );
              }

        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
    }




}
