import { Injectable } from '@nestjs/common'
import { AsignaturaTipo } from 'src/academico/entidades/asignaturaTipo.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { UnidadTerritorial } from 'src/academico/entidades/unidadTerritorial.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class UnidadTerritorialRepository {
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(UnidadTerritorial).find();
    }

    async getOneById(id:number){
        return  await this.dataSource.getRepository(UnidadTerritorial).findOneBy({id:id});
    }

    
    
}
