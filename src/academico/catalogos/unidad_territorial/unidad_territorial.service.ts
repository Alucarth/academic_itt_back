import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadTerritorial } from 'src/academico/entidades/unidadTerritorial.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnidadTerritorialService {
    constructor(
        @InjectRepository(UnidadTerritorial) private unidadTerritorialRepository: Repository<UnidadTerritorial>,
    ){}
    async getAll(){
        return await this.unidadTerritorialRepository.find()
    }
}
