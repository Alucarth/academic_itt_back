import { Injectable } from '@nestjs/common'
import { JurisdiccionGeografica } from 'src/academico/entidades/jurisdiccionGeografica.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateJurisdiccionGeograficaDto } from './dto/createJurisdiccionGeografica.dto';
import { UpdateJurisdiccionGeograficaDto } from './dto/updateJurisdiccionGeografica.dto';

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

    async getCodigo(municipio, provincia, departamento) {
        const values = [
          municipio,
          provincia,
          departamento
        ];
        /*
        const sql =
          "select * from sp_genera_codigo($1,$2,$3)";
        const data = await this.dataSource.getRepository(JurisdiccionGeografica).query(sql, values);*/
       // console.log(data);
        //return data;
        return 123456789;
      }

      async createJurisdiccionGeografica(dto: CreateJurisdiccionGeograficaDto, transaction) {
       
        const jurisdiccion  = new JurisdiccionGeografica();
        jurisdiccion.codigoEdificioEducativo = dto.codigo;
        jurisdiccion.nombreEdificioEducativo = '';
        jurisdiccion.distritoUnidadTerritorialId = 31352;//catalogo 0
        jurisdiccion.localidadUnidadTerritorial2012Id = dto.localidadUnidadTerritorial2012Id?dto.localidadUnidadTerritorial2012Id:0;
        jurisdiccion.localidadUnidadTerritorial2001Id = dto.localidadUnidadTerritorial2001Id?dto.localidadUnidadTerritorial2001Id:0;
        jurisdiccion.cordx = dto.cordx;
        jurisdiccion.cordy = dto.cordy;
        jurisdiccion.acreditacionTipoId = dto.acreditacionTipoId;
        jurisdiccion.jurisdiccionValidacionTipoId = dto.jurisdiccionValidacionTipoId;
        jurisdiccion.direccion = dto.direccion;
        jurisdiccion.zona = dto.zona;
        jurisdiccion.observacion = dto.observacion;
        return await transaction.getRepository(JurisdiccionGeografica).save(jurisdiccion);
    
      }
      async updateJurisdiccionGeografica(
        id: number,
        dto:UpdateJurisdiccionGeograficaDto,
        transaction:EntityManager
      ) {
        const repo = transaction
          ? transaction.getRepository(JurisdiccionGeografica)
          : this.dataSource.getRepository(JurisdiccionGeografica)
    
        return await repo
          .createQueryBuilder()
          .update(JurisdiccionGeografica)
          .set({
            cordx:dto.cordx,
            cordy:dto.cordy,
            direccion:dto.direccion,
            zona:dto.zona,
          })
          .where({ id: id })
          .execute()
      }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
