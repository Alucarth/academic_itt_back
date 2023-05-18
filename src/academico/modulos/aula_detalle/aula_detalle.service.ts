import { Inject, Injectable } from '@nestjs/common';
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
}
