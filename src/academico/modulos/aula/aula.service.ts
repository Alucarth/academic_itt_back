import { Inject, Injectable } from '@nestjs/common';
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
}
