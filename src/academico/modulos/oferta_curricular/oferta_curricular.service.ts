import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OfertaCurricularRepository } from './oferta_curricular.repository';

@Injectable()
export class OfertaCurricularService {
    constructor(
        
        @Inject(OfertaCurricularRepository) 
        private ofertaCurricularRepository: OfertaCurricularRepository,

       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.ofertaCurricularRepository.getAll()
        return cursos
    }

    async getAllByCarreraId(id:number){
        const cursos = await this.ofertaCurricularRepository.getAllByCarreraId(id)
        return cursos
    }
}
