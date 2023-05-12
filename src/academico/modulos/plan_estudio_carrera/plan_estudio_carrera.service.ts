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
        private carreraAutorizadaRepository = CarreraAutorizadaRepository,
         
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
    async getCarreraById(id:number){
        
        const carrera = await this.planEstudioCarreraRepository.findCarreraById(id)
        
        return carrera
    }
    async getResolucionesByCarreraId(
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number){
        
        const carrera = await this.planEstudioCarreraRepository.findResolucionesByCarreraId(
            carrera_id,
            nivel_id,
            area_id,
            intervalo_id,
            tiempo)
        return carrera
    }

    async planesCarreraId(id:number){
        
        //const sucursal =  await this.institucionEducativaSucursalRepository.findSucursalBySieGestion(1, 2023);
        
        
        //console.log(carrera);
        
        console.log("datoooo");
        //onsole.log(carrera);
       /* if(dato){
            const carreras = await this.planEstudioCarreraRepository.findResolucionesByCarreraId(
                 dato.carreraTipoId,
                 dato.nivelAcademicoTipoId,
                 dato.areaTipoId,
                 dato.intervaloGestionTipoId,
                 dato.tiempo

            )
            return carreras
        }*/
        
    }
}
