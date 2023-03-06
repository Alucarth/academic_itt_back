import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnoTipo } from 'src/academico/entidades/turnoTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TurnoTipoService {
    constructor(
        @InjectRepository(TurnoTipo) private turnoTipoRepository: Repository<TurnoTipo>,
    ){}
    async getAll(){
        const turnos = await this.turnoTipoRepository.find()
        return turnos
    }
    async getById(id: number){
        const turno = await this.turnoTipoRepository.findOneBy({ id : id })
        return turno
    }
}
