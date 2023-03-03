import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdiomaTipo } from 'src/academico/entidades/idiomaTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdiomaTipoService {
    constructor(
        @InjectRepository(IdiomaTipo) private idiomaTipoRepository: Repository<IdiomaTipo>,
    ){}
    async getAll(){
        return await this.idiomaTipoRepository.find()
    }
}
