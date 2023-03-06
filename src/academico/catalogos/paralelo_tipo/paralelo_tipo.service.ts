import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParaleloTipo } from 'src/academico/entidades/paraleloTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParaleloTipoService {
    constructor(
        @InjectRepository(ParaleloTipo) private paraleloTipoRepository: Repository<ParaleloTipo>,
    ){}
    async getAll(){
        const turnos = await this.paraleloTipoRepository.find()
        return turnos
    }
    async getById(id: number){
        const turno = await this.paraleloTipoRepository.findOneBy({ id : id })
        return turno
    }
}
