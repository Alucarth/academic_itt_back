import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EspecialidadTipo } from 'src/academico/entidades/especialidadTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EspecialidadTipoService {
    constructor(
        @InjectRepository(EspecialidadTipo)
        private especialidadTipoRepository: Repository<EspecialidadTipo>
    ){}
        async getAll(){
            return await this.especialidadTipoRepository.find()
        }
}
