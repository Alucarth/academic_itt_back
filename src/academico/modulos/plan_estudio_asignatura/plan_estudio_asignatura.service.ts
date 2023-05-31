import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { PlanEstudioAsignaturaRepository } from './plan_estudio_asignatura.repository';

@Injectable()
export class PlanEstudioAsignaturaService {
    constructor(
        
        @Inject(PlanEstudioAsignaturaRepository) 
        private planEstudioAsignaturaRepository: PlanEstudioAsignaturaRepository,
       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.planEstudioAsignaturaRepository.getAll()
        return cursos
    }
    
    async getAsignaturasByPlanRegimen(idplan:number, idregimen:number){
        const cursos = await this.planEstudioAsignaturaRepository.findAsignaturasByPlanRegimen(idplan, idregimen);
        if(cursos){
            return this._serviceResp.respuestaHttp201(
              cursos,
              'Resultados encontrados !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp404(
          "",
          'No se encontraron resultados !!',
          '',
      );
    }

    async getAsignaturasPrerequisitosByPlan(id:number){
      const cursos = await this.planEstudioAsignaturaRepository.findAsignaturasPrerequisitosByPlan(id);
      if(cursos){
          return this._serviceResp.respuestaHttp201(
            cursos,
            'Resultados encontrados !!',
            '',
        );
      }
      return this._serviceResp.respuestaHttp404(
        "",
        'No se encontraron resultados !!',
        '',
    );
  }

    async crearPlanAsignatura (dto: CreatePlanEstudioAsignaturaDto[]) {
       
        console.log("lista array inicio");
        console.log(dto);
        console.log(dto.length);
        console.log("lista array");
       /* const planesAsignaturas = this.planEstudioAsignaturaRepository.getAsignaturasByPLanEstudioUId();

        const  nuevos = this.verificarPlanAsignatura(
            usuarioRoles,
            roles
          )*/
        
            const op = async (transaction: EntityManager) => {

                const nuevoArray = await this.planEstudioAsignaturaRepository.crearPlanEstudioAsignatura(
                    1, 
                    dto, 
                    transaction
                );
              return nuevoArray;
            }
  
            const crearResult = await this.planEstudioAsignaturaRepository.runTransaction(op)
  
            if(crearResult.length>0){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro de asignaturas Creado !!',
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
