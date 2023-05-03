import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DependenciaTipo } from 'src/academico/entidades/dependenciaTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';

@Injectable()
export class DependenciaTipoService {
    constructor(
        @InjectRepository(DependenciaTipo) private dependenciaTipoRepositorio: Repository<DependenciaTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.dependenciaTipoRepositorio.find()
    }
}
