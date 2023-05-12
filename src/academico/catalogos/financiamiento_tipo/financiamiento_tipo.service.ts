import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinanciamientoTipo } from 'src/academico/entidades/financiamientoTipo.entity';
import { NotFoundException , HttpException} from '@nestjs/common';
import { RespuestaSigedService } from '../../../shared/respuesta.service'


@Injectable()
export class FinanciamientoTipoService {

    constructor(
        @InjectRepository(FinanciamientoTipo)
        private financiamientoTipoRepository: Repository<FinanciamientoTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}
        async getAll(){
            //var result: EspecialidadTipo[] = [];
            const result =  await this.financiamientoTipoRepository.find()

            return this._serviceResp.respuestaHttp200(
            result,
            'Registro Encontrado !!',
            '',
            );

        }


}
