import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { PlanEstudioCarreraRepository } from './plan_estudio_carrera.repository';

@Injectable()
export class PlanEstudioCarreraService {
    constructor(
        
        @Inject(PlanEstudioCarreraRepository) 
        private planEstudioCarreraRepository: PlanEstudioCarreraRepository,
        
        @Inject(CarreraAutorizadaRepository) 
        private carreraAutorizadaRepository: CarreraAutorizadaRepository,
         
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getResolucionesAll(){
        const carreras = await this.planEstudioCarreraRepository.getResolucionesAll()
        return carreras
    }
    async getCarrerasResolucionId(id:number){
        const carreras = await this.planEstudioCarreraRepository.findCarrerasByResolucionId(id)
        return carreras
    }
    async getPlanesCarreraById(id:number){
        
        const carrera = await this.planEstudioCarreraRepository.findCarreraById(id)
        
        return carrera
    }
    async getResolucionesByData(
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number){
        
        const carrera = await this.planEstudioCarreraRepository.findResolucionesByData(
            carrera_id,
            nivel_id,
            area_id,
            intervalo_id,
            tiempo)
        return carrera
    }

    async getResolucionesByCarreraAutorizadaId(id:number){
        
        const carreraAutorizada = await this.carreraAutorizadaRepository.getCarreraAutorizadaById(id);

        if(carreraAutorizada){
            const resoluciones = await this.planEstudioCarreraRepository.findResolucionesByData(
                carreraAutorizada.carrera_id,
                carreraAutorizada.nivel_academico_tipo_id,
                carreraAutorizada.area_id,
                carreraAutorizada.intervalo_gestion_tipo_id,
                carreraAutorizada.tiempo_estudio
            )
            if(resoluciones.length>0){
                return this._serviceResp.respuestaHttp201(
                    resoluciones,
                    "Registro Encontrado !!",
                    ""
                );
            }
            else{
                return this._serviceResp.respuestaHttp404(
                    '',
                    "No existen resoluciones de planes de estudio !!",
                    ""
                  );
            }
        }
        
        return this._serviceResp.respuestaHttp404(
            '',
            "Se produjo un error !!",
            ""
          );
    }
}
