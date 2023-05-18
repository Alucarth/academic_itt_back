import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';

@Injectable()
export class OperativoCarreraAutorizadaService {
    constructor(
        @Inject(OperativoCarreraAutorizadaRepository)
        private operativoCarreraAutorizadaRepositorio: OperativoCarreraAutorizadaRepository,

        private _serviceResp: RespuestaSigedService,
    ){}
    
    async findAllOperativos(){
        return await this.operativoCarreraAutorizadaRepositorio.getAll();
    }
    async findAllOperativosCarrera(id:number){
        const operativos = await this.operativoCarreraAutorizadaRepositorio.getAllOperativosCarrera(id);
        if(operativos.length > 0){
            return this._serviceResp.respuestaHttp201(
                operativos,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    async findOperativoActivoCarrera(id:number){
        const operativos = await this.operativoCarreraAutorizadaRepositorio.getOperativoVigenteCarrera(id);
        if(operativos.length > 0){
            return this._serviceResp.respuestaHttp201(
                operativos,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    
    async createOperativoCarrera (dto: CreateOperativoCarreraAutorizadaDto) {
       
            const op = async (transaction: EntityManager) => {
              
              const nuevoOperativo =  await this.operativoCarreraAutorizadaRepositorio.createOperativoCarrera(
                dto,
                transaction
              );
              return nuevoOperativo;
            }
  
            const crearResult = await this.operativoCarreraAutorizadaRepositorio.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult.id,
                  'Registro de operativo Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
    }
}
