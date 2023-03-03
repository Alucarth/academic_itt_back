import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaGeograficaTipo } from 'src/academico/entidades/areaGeograficaTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaGeograficaTipoService {
    constructor(
        @InjectRepository(AreaGeograficaTipo) private areaGeograficaTipoRepository: Repository<AreaGeograficaTipo>,
    ){}
    async getAll(){
        return await this.areaGeograficaTipoRepository.find()
    }
}

