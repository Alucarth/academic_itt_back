import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraTipo } from 'src/academico/entidades/carrerraTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarreraTipoService {
    constructor(
        @InjectRepository(CarreraTipo)
        private carreraTipoRepository: Repository<CarreraTipo>,
    ){}
        async getAll(){            
            return  await this.carreraTipoRepository.find();
        }
}
