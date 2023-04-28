import { Injectable } from '@nestjs/common'
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';


@Injectable()
export class OfertaAcademicaMaestroInscripcionRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(OfertaAcademicaMaestroInscripcionRepository).find();
        
    }

    async createOfertaAcademicaMaestroInscripcion(


        dto: CreateOfertaAcademicaMaestroInscripcionDto, 
        transaction: EntityManager
        ) {

            const ofertasAcademicas: OfertaAcademicaMaestroInscripcion[] = dto.ofertaAcademica.map((item) => {     
                const ofertaAcademicaMaestroInscripcion  = new OfertaAcademicaMaestroInscripcion();
                ofertaAcademicaMaestroInscripcion.maestroInscripcionId = dto.maestroInscripcionId;
                ofertaAcademicaMaestroInscripcion.ofertaAcademicaId =  item.id;
                return ofertaAcademicaMaestroInscripcion;
            });
     
        const result = await transaction.getRepository(OfertaAcademicaMaestroInscripcion).save(ofertasAcademicas);
       
        return result;
    }
   
   
    
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }

    async getAllByEtapa(id:number, gestion:number, periodo:number){
        console.log(id);
        console.log(gestion);
        console.log(periodo);
                const cursos = await this.dataSource.getRepository(OfertaAcademicaMaestroInscripcion)
                .createQueryBuilder("a")
                .innerJoinAndSelect("a.maestroInscripcion", "b")
                .innerJoinAndSelect("b.persona", "r")
                .innerJoinAndSelect("a.ofertaAcademica", "o")
                .innerJoinAndSelect("o.institucionEducativaCurso", "i")
                .innerJoinAndSelect("i.etapaEducativa", "e")
                .innerJoinAndSelect("i.turnoTipo", "t")
                .innerJoinAndSelect("i.paraleloTipo", "p")
                .innerJoinAndSelect("o.asignaturaTipo", "at")
                .where('i.periodoTipo = :periodo ', { periodo })
                .where('i.gestionTipo = :gestion ', { gestion })
                .where('e.etapaEducativaId = :id ', { id })
                .orderBy('a.id', 'ASC')
                .getMany();
                console.log("ofertas desde backen");
                console.log(cursos);
                return cursos;
                
    }

    async getOfertasAcademicas(idMaestroInscripcion: number) {
        return await this.dataSource
          .getRepository(OfertaAcademicaMaestroInscripcion)
          .createQueryBuilder('o')
          .where('o.maestroInscripcionId = :idMaestroInscripcion', { idMaestroInscripcion })
          .getMany()
    }

    async deleteOfertaAcademicaMaestroInscripcion(
        id: number, 
        transaction: EntityManager){
        
        await  transaction
         .getRepository(OfertaAcademicaMaestroInscripcion)
         .createQueryBuilder('o')
         .delete()
         .from(OfertaAcademicaMaestroInscripcion)
         .where('id = :id', { id:id })
         .execute();
         
       return await  transaction.getRepository(OfertaAcademicaMaestroInscripcion).delete(id)

    }
}
