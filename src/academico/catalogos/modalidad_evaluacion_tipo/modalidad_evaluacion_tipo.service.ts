import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class ModalidadEvaluacionTipoService {
    constructor(
        @InjectRepository(ModalidadEvaluacionTipo) 
        private modalidadEvaluacionTipoRepository: Repository<ModalidadEvaluacionTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const modalidad = await this.modalidadEvaluacionTipoRepository.find()
        return modalidad
    }
    async getAllByRegimen(id:number){
        const modalidad = await this.modalidadEvaluacionTipoRepository.findBy({
            intervaloGestionTipoId:id
        })
        return modalidad
    }
}
