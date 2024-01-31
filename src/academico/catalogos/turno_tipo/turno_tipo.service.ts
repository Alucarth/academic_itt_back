import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TurnoTipo } from 'src/academico/entidades/turnoTipo.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TurnoTipoService {
    constructor(
        @InjectRepository(TurnoTipo) private turnoTipoRepository: Repository<TurnoTipo>,
    ){}
    async getAll(){
        const turnos = await this.turnoTipoRepository.find({
            select:{ id:true, turno:true },
            where: {id : In([1,2,4])}
        })
        return turnos
    }
    async getById(id: number){
        const turno = await this.turnoTipoRepository.findOneBy({ id : id })
        return turno
    }
}
