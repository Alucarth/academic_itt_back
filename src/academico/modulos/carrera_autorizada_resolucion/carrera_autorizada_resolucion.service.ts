<<<<<<< HEAD
import { Inject, Injectable } from '@nestjs/common';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';

@Injectable()
export class CarreraAutorizadaResolucionService {
    constructor(
        @Inject(CarreraAutorizadaResolucionRepository)
        private carreraAutorizadaResolucionRepositorio: CarreraAutorizadaResolucionRepository,
      
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


}
=======
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarreraAutorizadaResolucionService {}
>>>>>>> ec8ea5b0c2aad791f271e2c95850f9c3848a7cd6
