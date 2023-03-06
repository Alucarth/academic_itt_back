import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GestionTipo } from 'src/academico/entidades/gestionTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GestionTipoService {
  
    constructor(
        @InjectRepository(GestionTipo) private gestionTipoRepository: Repository<GestionTipo>,
    ){}
    
    async getAll(){
        return await this.gestionTipoRepository.find()
    }

    async getGestionVigente(){
        return await this.gestionTipoRepository.findOneBy({ vigente:true })
    }
    
}
