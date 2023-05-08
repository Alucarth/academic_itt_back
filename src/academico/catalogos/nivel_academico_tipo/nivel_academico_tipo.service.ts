import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NivelAcademicoTipo } from 'src/academico/entidades/nivelAcademicoTipo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class NivelAcademicoTipoService {
    constructor(
        @InjectRepository(NivelAcademicoTipo)
        private nivelAcademicoTipoRepository: Repository<NivelAcademicoTipo>,
        
    ){}
        async getAllItt(){
            return  await this.nivelAcademicoTipoRepository.findBy({ 
                id: In([1, 2]),
            });
        }
}
