import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegimenGradoTipo } from 'src/academico/entidades/regimenGradoTipo.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Like, Repository } from 'typeorm';

@Injectable()
export class RegimenGradoTipoService {
    constructor(
        @InjectRepository(RegimenGradoTipo)
        private regimenGradoTipoRepository: Repository<RegimenGradoTipo>,
        private _serviceResp: RespuestaSigedService, 
    ){}
        async getAll(){
            //var result: EspecialidadTipo[] = [];
            const result =  await this.regimenGradoTipoRepository.find()

            return this._serviceResp.respuestaHttp200(
            result,
            'Registro Encontrado !!',
            '',
            );

        }
        async getByRegimen(regimen){
            //var result: EspecialidadTipo[] = [];
            const result =  await this.regimenGradoTipoRepository.findOneBy({'regimenGrado':regimen})
            if(result){
                return this._serviceResp.respuestaHttp200(
                result,
                'Registro Encontrado !!',
                '',
                );
            }
            return this._serviceResp.respuestaHttp500(
                "",
                'No se encontraron resultados !!',
                '',
            );

        }

        async findByRegimenGrado(value:any)
        {
            const result = await this.regimenGradoTipoRepository.find({
                select:{id:true,regimenGrado:true},
                where:{
                    regimenGrado: Like(`%${value}`),
                }
            })
            console.log('resulta years',result)
            if(result)
            {
                return this._serviceResp.respuestaHttp200(result,'resultado encontrado','')
            }

            return this._serviceResp.respuestaHttp500("","No se contraron resultados !!!","")
        }
}
