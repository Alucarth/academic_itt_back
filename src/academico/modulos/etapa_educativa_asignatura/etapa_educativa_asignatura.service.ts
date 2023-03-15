import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { Repository } from 'typeorm';
import { EtapaEducativaAsignaturaRepository } from './etapa_educativa_asignatura.repository';

@Injectable()
export class EtapaEducativaAsignaturaService {
    constructor(
        @Inject(EtapaEducativaAsignaturaRepository)
        private etapaEducativaAsignaturaRepositorio: EtapaEducativaAsignaturaRepository,
    ){}

    async getAll(){
        return await this.etapaEducativaAsignaturaRepositorio.getAll();
    }
    
    async findAsignaturasByEspecialidad( id:number ){
        return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidad(id);
      
    }
    async findAsignaturasByEspecialidadEtapa( id:number, etapa:number ){
        return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidadEtapa(id, etapa);
        
    }

    async findAsignaturasByEspecialidadEtapaPlan( id:number, etapa:number ,  plan:number ){
        return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEspecialidadEtapaPlan(id, etapa, plan);
    }
    
    async findAsignaturasByEtapaId( id:number ){
        return await this.etapaEducativaAsignaturaRepositorio.findAsignaturasByEtapaId(id);
        
    }
   
}
