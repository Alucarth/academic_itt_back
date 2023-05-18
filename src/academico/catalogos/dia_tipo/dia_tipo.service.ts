import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaTipo } from 'src/academico/entidades/diaTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class DiaTipoService {
    constructor(
        @InjectRepository(DiaTipo) 
        private diaTipoRepository: Repository<DiaTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const dia = await this.diaTipoRepository.find()
        return dia
    }
}
