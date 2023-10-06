import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadoInstituto } from 'src/academico/entidades/estadoInstituto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadoInsitutoService {
    constructor(
        @InjectRepository(EstadoInstituto) private estadoInstitutoRepository: Repository<EstadoInstituto>,
    ){}
    async getAll(){
        return await this.estadoInstitutoRepository.find()
    }
}
