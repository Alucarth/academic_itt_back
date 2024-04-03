import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DependenciaTipo } from 'src/academico/entidades/dependenciaTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class DependenciaTipoService {
    constructor(
        @InjectRepository(DependenciaTipo) private dependenciaTipoRepositorio: Repository<DependenciaTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        return await this.dependenciaTipoRepositorio.find({
            where: { id: MoreThan(0)}
        })
    }

    async getDependenciaTipo(id: number)
    {
        return await this.dependenciaTipoRepositorio.findOneBy({ id: id })
    }
}
