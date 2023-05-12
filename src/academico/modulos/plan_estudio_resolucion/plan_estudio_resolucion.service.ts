import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { PlanEstudioResolucionRepository } from './plan_estudio_resolucion.repository';

@Injectable()
export class PlanEstudioResolucionService {
    constructor(
        
        @Inject(PlanEstudioResolucionRepository) 
        private planEstudioResolucionRepository: PlanEstudioResolucionRepository,

        @Inject(CarreraAutorizadaRepository) 
        private carreraAutorizadaRepository: CarreraAutorizadaRepository,
       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getResolucionesAll(){
        const result = await this.planEstudioResolucionRepository.getResolucionesAll()
        return this._serviceResp.respuestaHttp200(
            result,
            "",
            "Registros Encontrados !!"
          );
        
    }
    async getAll(){
        const cursos = await this.planEstudioResolucionRepository.getAll()
        return cursos
    }

    async crear(dto: CreatePlanEstudioResolucionDto) {
        // verificar la carrera ya existe
    const carreraAutorizada =await this.carreraAutorizadaRepository.getCarreraAutorizadaById(dto.carrera_autorizada_id);
    console.log("carrera autorizada");
    console.log(carreraAutorizada);
        const op = async (transaction: EntityManager) => {
            const planResolucion = await this.planEstudioResolucionRepository.crearPlanEstudioResolucion(dto, transaction);
            if(planResolucion?.id){
              return planResolucion;
            }
        }
        const crearResult = await this.planEstudioResolucionRepository.runTransaction(op);
        console.log("ssssss result");
        console.log(crearResult);

        if(crearResult){
            //mandamos datos de carrera_autorizada
            let datos = {
                plan_estudio_resolucion_id: crearResult.id,
                carrera_autorizada_id: carreraAutorizada.carrera_autorizada_id,
                carrera_id: carreraAutorizada.carrera_id,
                carrera: carreraAutorizada.carrera,
                area_id: carreraAutorizada.area_id,
                area: carreraAutorizada.area,
                tiempo_estudio: carreraAutorizada.tiempo_estudio,
                carga_horaria: carreraAutorizada.area,
                nivel_academico_tipo_id: carreraAutorizada.nivel_academico_tipo_id,
                nivel_academico: carreraAutorizada.nivel_academico,
                intervalo_gestion_tipo_id: carreraAutorizada.intervalo_gestion_tipo_id,
                regimen_estudio: carreraAutorizada.regimen_estudio,
            }      
          return this._serviceResp.respuestaHttp201(
              datos,
              'Registro de carrera Creado !!',
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
