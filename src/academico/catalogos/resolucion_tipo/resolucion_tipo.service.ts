import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResolucionTipo } from 'src/academico/entidades/resolucionTipo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class ResolucionTipoService {
    constructor(
        @InjectRepository(ResolucionTipo)
        private resolucionTipoRepository: Repository<ResolucionTipo>,
    ){}
        async getAll(){            
            return  await this.resolucionTipoRepository.find({where: { id: In([1,5,4]) }});
        }
}
