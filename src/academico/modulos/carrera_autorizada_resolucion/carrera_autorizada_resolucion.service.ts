import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
@Injectable()
export class CarreraAutorizadaResolucionService {
    constructor(
        @Inject(CarreraAutorizadaResolucionRepository)
        private carreraAutorizadaResolucionRepositorio: CarreraAutorizadaResolucionRepository,
        @Inject(CarreraAutorizadaRepository)
        private carreraAutorizadaRepositorio: CarreraAutorizadaRepository,

      
        //private _serviceResp: RespuestaSigedService
      ) {}
      async getOneById(id: number) {
        const carrera = await this.carreraAutorizadaResolucionRepositorio.getOneBy(id);
        return carrera;
      }
      async getAll(id: number) {
        const carrera = await this.carreraAutorizadaResolucionRepositorio.getAll();
        return carrera;
      }

      async crear(dto: CreateCarreraAutorizadaResolucionDto) {
        // verificar la carrera ya existe
       
    
        const op = async (transaction: EntityManager) => {
            const nuevaCarreraAutorizada = await this.carreraAutorizadaRepositorio.createAutorizada(dto, transaction);
         if(nuevaCarreraAutorizada?.id){
            await this.carreraAutorizadaResolucionRepositorio.crearCarreraResolucion(
              1, 
              nuevaCarreraAutorizada?.id, 
              dto,
              transaction
          );
          
         }
        }
        const crearResult = await this.carreraAutorizadaResolucionRepositorio.runTransaction(op)
    
       
    
        return crearResult
      }
    }
