import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoCivilTipo } from 'src/academico/entidades/estadoCivilTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoCivilTipoService {
    constructor(
        @InjectRepository(EstadoCivilTipo) private estadoCivilTipoRepository: Repository<EstadoCivilTipo>,
    ){}
    async getAll(){
        return await this.estadoCivilTipoRepository.find()
    }
}
