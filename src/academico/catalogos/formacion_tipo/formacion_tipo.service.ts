import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormacionTipo } from 'src/academico/entidades/formacionTipo.entity';
import { NotFoundException , HttpException} from '@nestjs/common';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Injectable()
export class FormacionTipoService {

    constructor(
        @InjectRepository(FormacionTipo)
        private formacionTipoRepository: Repository<FormacionTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}
        async getAll(){
            //var result: EspecialidadTipo[] = [];
            const result =  await this.formacionTipoRepository.find()

            return this._serviceResp.respuestaHttp201(
            result,
            'Registro Encontrado !!',
            '',
            );

        }

}
