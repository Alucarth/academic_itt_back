import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntervaloGestionTipo } from 'src/academico/entidades/intervaloGestionTipo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class IntervaloGestionTipoService {
    constructor(
        @InjectRepository(IntervaloGestionTipo)
        private intervaloGestionTipoRepository: Repository<IntervaloGestionTipo>,
        
    ){}
        async getAllItt(){
            return  await this.intervaloGestionTipoRepository.findBy({ 
                id: In([1, 4]),
            });
        }
}
