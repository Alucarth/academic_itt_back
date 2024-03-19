import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParaleloTipo } from 'src/academico/entidades/paraleloTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class ParaleloTipoService {
    constructor(
        @InjectRepository(ParaleloTipo) 
        private paraleloTipoRepository: Repository<ParaleloTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll()
    {
        //devolver menos homologacion
        return await this.paraleloTipoRepository.find({
            where: {id: LessThan(48) }
        })

    }
    async getById(id: number){
        const paralelo = await this.paraleloTipoRepository.findOneBy({ id : id })
        return paralelo
    }
}
