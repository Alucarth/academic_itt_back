import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValoracionTipo } from 'src/academico/entidades/valoracionTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class ValoracionTipoService {
    constructor(
        @InjectRepository(ValoracionTipo) 
        private valoracionTipoRepository: Repository<ValoracionTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const nota = await this.valoracionTipoRepository.find()
        return nota
    }
}
