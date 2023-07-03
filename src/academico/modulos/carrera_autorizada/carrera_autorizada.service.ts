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
        if(carreras.length>0){
            return this._serviceResp.respuestaHttp201(
                carreras,
                "Datos Encontrados !!",
                ""
              );    
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }
      async getCursosByIeId(id: number) {
        const cursos = await this.carreraAutorizadaRepositorio.getAllCursosByIeId(id);
        if(cursos.length>0){
            return this._serviceResp.respuestaHttp201(
                cursos,
                "Datos Encontrados !!",
                ""
              );    
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }
      async getCarreraById(id: number) {
        const carrera = await this.carreraAutorizadaRepositorio.getCarreraAutorizadaById(id);
        if(carrera){
        return this._serviceResp.respuestaHttp201(
            carrera,
            "Datos Encontrados !!",
            ""
          );
        } 
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados !!',
            '',
        );
      }
      async getTotalCarreras(){
        const carreras = await this.carreraAutorizadaRepositorio.findTotalCarreras();
        return carreras;
      }

      async getListaCarreras(){
        const carreras = await this.carreraAutorizadaRepositorio.findListaCarreras();
        return carreras;
      }

      async getTotalEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaCarrerasEstudiantes(id);
        return carreras;
      }
      async getTotalDepartamentoDependencias(){
        const carreras = await this.carreraAutorizadaRepositorio.findTotalDependencias();
        return carreras;
      }
      async getListaParalelosEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListParalelosaCarrerasEstudiantes(id);
        return carreras;
      }
      async getListaAsignaturaParaleloEstudianteCarrera(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListAsignaturaParaleloCarreraEstudiante(id);
        return carreras;
      }
      async getListaAsignaturasParaleloEstudiantes(id:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaAsignaturasParaleloEstudiantes(id);
        return carreras;
      }

      async getListaCarrerasRegimen(lugar:number, dependencia:number){
        const carreras = await this.carreraAutorizadaRepositorio.findListaRegimenCarrerasEstudiantes(lugar, dependencia);
        return carreras;
      }
}
