import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from './carrera_autorizada.repository';

@Injectable()
export class CarreraAutorizadaService {
    constructor(
        @Inject(CarreraAutorizadaRepository)
        private carreraAutorizadaRepositorio: CarreraAutorizadaRepository,
      
        private _serviceResp: RespuestaSigedService
      ) {}
      async getCarrerasBySucursalId(id: number) {
        const carreras = await this.carreraAutorizadaRepositorio.geAllCarrerasBySucursalId(id);
        return this._serviceResp.respuestaHttp201(
            carreras,
            "Datos Encontrados !!",
            ""
          );
      }
      async getCarrerasByIeId(id: number) {
        const carreras = await this.carreraAutorizadaRepositorio.geAllCarrerasByIeId(id);
        return this._serviceResp.respuestaHttp201(
            carreras,
            "Datos Encontrados !!",
            ""
          );
      }
      async getCarreraById(id: number) {
        const carreras = await this.carreraAutorizadaRepositorio.geCarreraById(id);
        return this._serviceResp.respuestaHttp201(
            carreras,
            "Datos Encontrados !!",
            ""
          );
      }
      
}
