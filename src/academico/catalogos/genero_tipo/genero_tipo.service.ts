import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneroTipo } from 'src/academico/entidades/generoTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GeneroTipoService {
    constructor(
        @InjectRepository(GeneroTipo) private generoTipoRepository: Repository<GeneroTipo>,
    ){}
    async getAll(){
        return await this.generoTipoRepository.find()
    }
}
