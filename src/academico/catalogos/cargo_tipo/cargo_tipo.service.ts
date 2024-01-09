import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
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


    // SE FILTRA SOLO MAESTROS Y ADMINISTRATIVOS, DIRECTORES SE DEBE CREAR OTRO ENDPOINT PARA EL ROL DEPARTAMENTAL
    async getAll(){
        //var result: EspecialidadTipo[] = [];
        const result =  await this.cargoTipoRepository.findBy({
            id: Any([1,2,3,4,5,6,8,9,10,11,12])
        })

        return this._serviceResp.respuestaHttp200(
        result,
        'Registro Encontrado !!',
        '',
        );

    }

}
