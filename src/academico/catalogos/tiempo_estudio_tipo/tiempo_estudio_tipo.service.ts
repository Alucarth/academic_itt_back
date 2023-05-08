import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiempoEstudioTipo } from 'src/academico/entidades/tiempoEstudioTipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TiempoEstudioTipoService {
    constructor(
        @InjectRepository(TiempoEstudioTipo)
        private tiempoEstudioTipoRepository: Repository<TiempoEstudioTipo>,
        
    ){}
        async getAllItt(regimen:number, nivel:number){
        let tiempo;
            if(regimen==4 && nivel==2)
                tiempo = [1,2,3];
            if(regimen==4 && nivel==1)
                tiempo = [1,2];
            if(regimen==1 && nivel==2)
                tiempo = [1,2,3,4,5,6];
            if(regimen==1 && nivel==1)
                tiempo = [1,2,3,4];
            return tiempo;
        }
}
