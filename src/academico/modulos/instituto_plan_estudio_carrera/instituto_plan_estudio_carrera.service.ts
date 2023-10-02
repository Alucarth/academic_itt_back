import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';
import { InstitutoPlanEstudioCarreraRepository } from './instituto_plan_estudio_carrera.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
@Injectable()
export class InstitutoPlanEstudioCarreraService {
    constructor(
        @Inject(InstitutoPlanEstudioCarreraRepository)
        private institutoPlanEstudioCarreraRepository: InstitutoPlanEstudioCarreraRepository,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        const data = await this.institutoPlanEstudioCarreraRepository.getAll();
        return data;

    }
    async getOneById(id){
        const data = await this.institutoPlanEstudioCarreraRepository.findOneById(id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getGradosById(id){
        const data = await this.institutoPlanEstudioCarreraRepository.findGradosBy(id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getAsignaturasGradosById(id, grado){
        const data = await this.institutoPlanEstudioCarreraRepository.findAsignaturasGradoBy(id, grado);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getOneByPlanCarrera(plan_id:number, carrera_id:number){
        const data = await this.institutoPlanEstudioCarreraRepository.findOneByPlanCarrera(plan_id, carrera_id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getResolucionesCarreraAutorizadaId( id:number ){
       const result = await this.institutoPlanEstudioCarreraRepository.findResolucionesCarreraAutorizadaId(id);
       return result;    
    }
    

    async getPlanAsignaturaById( id:number ){
        const result = await this.institutoPlanEstudioCarreraRepository.findPlanAsignaturasById(id);
        return result;
    }

    async createInstitutoPlan (dto: CreateInstitutoPlanEstudioCarreraDto, user:UserEntity) {
      const institutoPlanCarrera = await this.getOneByPlanCarrera(dto.plan_estudio_carrera_id, dto.carrera_autorizada_id);
      //console.log("institutoPlanCarrera____", institutoPlanCarrera);
        if(institutoPlanCarrera.data!=''){ //console.log("ya existe ")
          return this._serviceResp.respuestaHttp201(
            institutoPlanCarrera,
            "El registro de instituto plan ya existe!!",
            ""
          );
        }else{ //console.log("crea")
            const op = async (transaction: EntityManager) => {
              const nuevoInstitutoPlan =  await this.institutoPlanEstudioCarreraRepository.createInstitutoPlanEstudioCarrera(
                user.id,
                dto,
                transaction
              )
              return nuevoInstitutoPlan;
            }
  
            const crearResult = await this.institutoPlanEstudioCarreraRepository.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro de instituo_plan Creado !!',
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
