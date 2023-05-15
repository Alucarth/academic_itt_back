import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';
import { InstitutoPlanEstudioCarreraRepository } from './instituto_plan_estudio_carrera.repository';

@Injectable()
export class InstitutoPlanEstudioCarreraService {
    constructor(
        @Inject(InstitutoPlanEstudioCarreraRepository)
        private institutoPlanEstudioCarreraRepository: InstitutoPlanEstudioCarreraRepository,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        const sucursales = await this.institutoPlanEstudioCarreraRepository.getAll();
        return sucursales;

    }
    async getResolucionesCarreraAutorizadaId( id:number ){
        const sucursal = await this.institutoPlanEstudioCarreraRepository.findResolucionesCarreraAutorizadaId(id);
        return sucursal;

        
    }

    async createInstitutoPlan (dto: CreateInstitutoPlanEstudioCarreraDto) {
  
  
            const op = async (transaction: EntityManager) => {
              const nuevoInstitutoPlan =  await this.institutoPlanEstudioCarreraRepository.createInstitutoPlanEstudioCarrera(
                1,
                dto,
                transaction
              )
              return nuevoInstitutoPlan;
            }
  
            const crearResult = await this.institutoPlanEstudioCarreraRepository.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult.id,
                  'Registro de curso y oferta Creado !!',
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
