import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventoTipo } from 'src/academico/entidades/eventoTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class EventoTipoService {
    constructor(
        @InjectRepository(EventoTipo) 
        private eventoTipoRepository: Repository<EventoTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const dia = await this.eventoTipoRepository.find()
        return dia
    }
}
