import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarreraAutorizadaResolucionService {
    constructor(
        @InjectRepository(CarreraAutorizadaResolucion)
        private carreraAutorizadaResolucionRepositorio: Repository<CarreraAutorizadaResolucion>,
      
        //private _serviceResp: RespuestaSigedService
      ) {}
      async getById(id: number) {
        const carrera = await this.carreraAutorizadaResolucionRepositorio.findOneBy({ id: id });
        return carrera;
      }
}
