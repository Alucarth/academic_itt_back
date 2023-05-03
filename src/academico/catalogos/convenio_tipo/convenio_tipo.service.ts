import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConvenioTipo } from 'src/academico/entidades/convenioTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class ConvenioTipoService {
    constructor(
        @InjectRepository(ConvenioTipo) private convenioTipoRepositorio: Repository<ConvenioTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.convenioTipoRepositorio.find()
    }
}
