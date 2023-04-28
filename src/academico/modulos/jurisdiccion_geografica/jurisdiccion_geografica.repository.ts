import { Injectable } from '@nestjs/common'
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class JurisdiccionGeograficaRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(JurisdiccionGeografica).find();
        
    }

    async getOneById(id:number){
        return  await this.dataSource.getRepository(JurisdiccionGeografica).findOneBy({id:id});
    }

    async getOneByCodigo2(id:number){
        return  await this.dataSource.getRepository(JurisdiccionGeografica).findOneBy({codigoEdificioEducativo:id});
    }
    async getOne2001ByCodigo(id: number) {
        
        const jurisdiccion = await this.dataSource.getRepository(JurisdiccionGeografica)
          .createQueryBuilder("a")
          .innerJoinAndSelect("a.localidadUnidadTerritorial2001", "b")
          .innerJoinAndSelect("b.unidadTerritorialTipo", "b1")
          .innerJoinAndSelect("b.unidadTerritorialPadre", "c")
          .innerJoinAndSelect("c.unidadTerritorialTipo", "c1")
          .innerJoinAndSelect("c.unidadTerritorialPadre", "d")
          .innerJoinAndSelect("d.unidadTerritorialTipo", "d1")
          .innerJoinAndSelect("d.unidadTerritorialPadre", "e")
          .innerJoinAndSelect("e.unidadTerritorialTipo", "e1")
          .innerJoinAndSelect("e.unidadTerritorialPadre", "f")
          .innerJoinAndSelect("f.unidadTerritorialTipo", "f1")
          .where("a.codigoEdificioEducativo = :id ", { id })
          .orderBy("a.id", "ASC")
          .getOne();
        
        return jurisdiccion;
    }
    async getOne2012ByCodigo(id: number) {
        const jurisdiccion = await this.dataSource.getRepository(JurisdiccionGeografica)
          .createQueryBuilder("a")
          .innerJoinAndSelect("a.localidadUnidadTerritorial2012", "b")
          .innerJoinAndSelect("b.unidadTerritorialTipo", "b1")
          .innerJoinAndSelect("b.unidadTerritorialPadre", "c")
          .innerJoinAndSelect("c.unidadTerritorialTipo", "c1")
          .innerJoinAndSelect("c.unidadTerritorialPadre", "d")
          .innerJoinAndSelect("d.unidadTerritorialTipo", "d1")
          .innerJoinAndSelect("d.unidadTerritorialPadre", "e")
          .innerJoinAndSelect("e.unidadTerritorialTipo", "e1")
          .innerJoinAndSelect("e.unidadTerritorialPadre", "f")
          .innerJoinAndSelect("f.unidadTerritorialTipo", "f1")
          .where("a.codigoEdificioEducativo = :id ", { id })
          .orderBy("a.id", "ASC")
          .getOne();
        
        return jurisdiccion;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
