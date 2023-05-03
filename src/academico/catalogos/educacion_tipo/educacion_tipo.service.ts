import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EducacionTipo } from 'src/academico/entidades/educacionTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class EducacionTipoService {
    constructor(
        @InjectRepository(EducacionTipo) private educacionTipoRepositorio: Repository<EducacionTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.educacionTipoRepositorio.find()
    }
    async getAllTipoInstituto(){
        return await this.educacionTipoRepositorio.findBy({sistemaEducacionTipoId:3})
    }
}
