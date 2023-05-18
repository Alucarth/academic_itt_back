import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParaleloTipo } from 'src/academico/entidades/paraleloTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class ParaleloTipoService {
    constructor(
        @InjectRepository(ParaleloTipo) 
        private paraleloTipoRepository: Repository<ParaleloTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const paralelo = await this.paraleloTipoRepository.find()
        return paralelo
    }
    async getById(id: number){
        const paralelo = await this.paraleloTipoRepository.findOneBy({ id : id })
        return paralelo
    }
}
