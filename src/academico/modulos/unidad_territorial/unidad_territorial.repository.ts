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

    async getDependientes(id: number) {
        
        const lugar = await this.dataSource.getRepository(UnidadTerritorial)
          .createQueryBuilder("b")
          .innerJoinAndSelect("b.unidadTerritorialTipo", "b1")
          .innerJoinAndSelect("b.unidadTerritorialPadre", "c")
          .innerJoinAndSelect("c.unidadTerritorialTipo", "c1")
          .innerJoinAndSelect("c.unidadTerritorialPadre", "d")
          .innerJoinAndSelect("d.unidadTerritorialTipo", "d1")
          .innerJoinAndSelect("d.unidadTerritorialPadre", "e")
          .innerJoinAndSelect("e.unidadTerritorialTipo", "e1")
          .innerJoinAndSelect("e.unidadTerritorialPadre", "f")
          .innerJoinAndSelect("f.unidadTerritorialTipo", "f1")
          .where("b.id = :id ", { id })
          .getOne();
        
        return lugar;
    }
    async getDepartamentos() {
        
        const lugar = await this.dataSource.getRepository(UnidadTerritorial)
          .createQueryBuilder("b")
          .where("b.unidadTerritorialTipo = 1 ")
          .getMany();
        
        return lugar;
    }
    
}
