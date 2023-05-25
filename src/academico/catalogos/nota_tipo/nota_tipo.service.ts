import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotaTipo } from 'src/academico/entidades/notaTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class NotaTipoService {
    constructor(
        @InjectRepository(NotaTipo) 
        private notaTipoRepository: Repository<NotaTipo>,
        private _serviceResp: RespuestaSigedService

    ){}
    async getAll(){
        const nota = await this.notaTipoRepository.find()
        return nota
    }
    async getById(id:number){
        const nota = await this.notaTipoRepository.findOneBy({'id':id})
        return nota
    }
}
