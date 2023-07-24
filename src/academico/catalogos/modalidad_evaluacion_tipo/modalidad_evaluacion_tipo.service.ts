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
        if(id==4){
           return await this.modalidadEvaluacionTipoRepository
            .createQueryBuilder('m')
            .where('id in (3,4,5,6,7,9)')
            .getMany();
        }

        if(id==1){
           return await this.modalidadEvaluacionTipoRepository
        .createQueryBuilder('m')
        .where('id in (1,2,7,9)')
        .getMany();
        }
        
    }
    async getAllByRegistroRegimen(id:number){
        if(id==4){
           return await this.modalidadEvaluacionTipoRepository
            .createQueryBuilder('m')
            .where('id in (3,4,5,6,9)')
            .getMany();
        }

        if(id==1){
           return await this.modalidadEvaluacionTipoRepository
        .createQueryBuilder('m')
        .where('id in (1,2,9)')
        .getMany();
        }
        
    }
}
