import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodoTipo } from 'src/academico/entidades/periodoTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PeriodoTipoService {
    constructor(
        @InjectRepository(PeriodoTipo) private periodoTipoRepository: Repository<PeriodoTipo>,
    ){}
    async getAll(){
        const periodos = await this.periodoTipoRepository.find()
        return periodos
    }
    async getById(id: number){
        const periodo = await this.periodoTipoRepository.findOneBy({ id : id })
        return periodo
    }
    async getPeriodoByIntervalo(id: number){
        const periodo = await this.periodoTipoRepository.findBy({ intervaloGestionTipoId : id })
        return periodo
    }
}
