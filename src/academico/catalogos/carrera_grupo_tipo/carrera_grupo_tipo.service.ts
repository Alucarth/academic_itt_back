import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraGrupoTipo } from 'src/academico/entidades/carreraGrupoTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarreraGrupoTipoService {
    constructor(
        @InjectRepository(CarreraGrupoTipo)
        private carreraGrupoTipo: Repository<CarreraGrupoTipo>,
        
    ){}
    async getAll(){
        return await this.carreraGrupoTipo.find()
    }
}
