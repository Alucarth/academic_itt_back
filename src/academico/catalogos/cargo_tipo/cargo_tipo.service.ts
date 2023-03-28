import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CargoTipo } from 'src/academico/entidades/cargoTipo.entity';
import { NotFoundException , HttpException} from '@nestjs/common';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Injectable()
export class CargoTipoService {

    constructor(
        @InjectRepository(CargoTipo)
        private cargoTipoRepository: Repository<CargoTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}
        async getAll(){
            //var result: EspecialidadTipo[] = [];
            const result =  await this.cargoTipoRepository.find()

            return this._serviceResp.respuestaHttp201(
            result,
            'Registro Encontrado !!',
            '',
            );

        }

}
