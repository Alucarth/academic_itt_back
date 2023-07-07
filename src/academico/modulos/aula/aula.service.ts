import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaRepository } from './aula.repository';

@Injectable()
export class AulaService {
    constructor(
        
        @Inject(AulaRepository) 
        private aulaRepository: AulaRepository,
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const s = await this.aulaRepository.getAll()
        return s
    }
    async getById(id:number){
        const aula = await this.aulaRepository.getByAulaId(id);
        return aula;
    }
    async getCalificacionesById(id:number){
        const aula = await this.aulaRepository.getCalificacionesByAulaId(id);
        return aula;
    }
    async deleteAula(id: number)
    {
        const estudiantes = await this.aulaRepository.getInscritosByAulaId(id);

     
      if(estudiantes.length>0){
        return this._serviceResp.respuestaHttp500(
            "",
            "No se puede eliminar los datos existen estudiantes inscritos !!",
            ""
          );
      }
      const resultDetalle = await this.aulaRepository.deleteAulaDetalle(id);

      const resultDocente = await this.aulaRepository.deleteAulaDocente(id);
    if(resultDetalle || resultDocente){
        const result = await this.aulaRepository.deleteAula(id);
        console.log("resultado",result);
        if (result.affected === 0) {
          throw new NotFoundException("registro no encontrado !");
        }
        return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
          
    }
    if (resultDetalle.affected === 0 ) {
        throw new NotFoundException("registro no encontrado !");
      }
     
    }
}
