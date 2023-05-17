import { Injectable } from '@nestjs/common'
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class OfertaCurricularRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(OfertaCurricular).find();
    }
    
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
    async getAllByCarreraId(id:number){
        
        console.log(id);
        const cursos = await this.dataSource.getRepository(OfertaCurricular)
        .createQueryBuilder("o")
        .innerJoinAndSelect("o.institutoPlanEstudioCarrera", "ip")
        .innerJoinAndSelect("o.gestionTipo", "g")
        .innerJoinAndSelect("o.periodoTipo", "p")
        .innerJoinAndSelect("o.planEstudioAsignatura", "pa")
        .innerJoinAndSelect("pa.asignaturaTipo", "a")
        .innerJoinAndSelect("pa.regimenGradoTipo", "r")
        .innerJoinAndSelect("o.aulas", "al")
        .innerJoinAndSelect("al.paraleloTipo", "pt")
        .where('ip.carreraAutorizadaId = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log("ofertas desde backen");
        console.log(cursos);
        return cursos;
        
    }
}
