import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaDetalleRepository } from './aula_detalle.repository';

@Injectable()
export class AulaDetalleService {
    constructor(
        
        @Inject(AulaDetalleRepository) 
        private aulaDetalleRepository: AulaDetalleRepository,
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const detalles = await this.aulaDetalleRepository.getAll()
        return detalles
    }
    async getDatoAulaDetalle(id, dia_tipo_id, hora_inicio, hora_fin){
        const detalle = await this.aulaDetalleRepository.getDatoAulaDetalle
        (id, dia_tipo_id, hora_inicio, hora_fin);
        return detalle;
    }
    async deleteDetalle(id: number)
    {
      const result =  await this.aulaDetalleRepository.deleteDetalle(id);
      console.log("result:", result);
      /*
        if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }*/
          return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
        
    }

}
