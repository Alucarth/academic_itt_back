import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadTerritorialTipo } from 'src/academico/entidades/unidadTerritorialTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnidadTerritorialTipoService {
    constructor(
        @InjectRepository(UnidadTerritorialTipo) private unidadTerritorialTipoRepository: Repository<UnidadTerritorialTipo>,
    ){}
    async getAll(){
        return await this.unidadTerritorialTipoRepository.find()
    }
}
