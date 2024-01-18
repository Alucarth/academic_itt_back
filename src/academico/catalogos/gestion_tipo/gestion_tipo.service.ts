import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GestionTipo } from 'src/academico/entidades/gestionTipo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class GestionTipoService {
  
    constructor(
        @InjectRepository(GestionTipo) private gestionTipoRepository: Repository<GestionTipo>,
    ){}

    async getAll(){
        return await this.gestionTipoRepository.find()
    }

    async getGestions ()
    {
        return await this.gestionTipoRepository.find({
        
            where:{id: In([ 2019, 2020, 2021, 2022, 2023, 2024])},
            order: { id: 'ASC'}
        })
    }

    
    async getGestionVigente(){
        return await this.gestionTipoRepository.findOneBy({ vigente : true })
    }
    
}
