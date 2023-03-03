import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SangreTipo } from 'src/academico/entidades/sangreTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SangreTipoService {
    constructor(
        @InjectRepository(SangreTipo) private sangreTipoRepository: Repository<SangreTipo>,
    ){}
    async getAll(){
        return await this.sangreTipoRepository.find()
    }
}
