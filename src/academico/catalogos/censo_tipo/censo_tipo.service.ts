import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CensoTipo } from 'src/academico/entidades/censoTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CensoTipoService {
    constructor(
        @InjectRepository(CensoTipo) private censoTipoRepository: Repository<CensoTipo>,
    ){}
    async getAll(){
        return await this.censoTipoRepository.find()
    }
}
