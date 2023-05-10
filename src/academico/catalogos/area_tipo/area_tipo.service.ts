import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaTipo } from 'src/academico/entidades/areaTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaTipoService {
    constructor(
        @InjectRepository(AreaTipo)
        private areaTipoRepository: Repository<AreaTipo>,
    ){}
        async getAll(){            
            return  await this.areaTipoRepository.find();
        }
}
