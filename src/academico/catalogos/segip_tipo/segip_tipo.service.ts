import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SegipTipo } from 'src/academico/entidades/segipTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SegipTipoService {
    constructor(
        @InjectRepository(SegipTipo) private segipTipoRepository: Repository<SegipTipo>,
    ){}
    async getAll(){
        return await this.segipTipoRepository.find()
    }
}
