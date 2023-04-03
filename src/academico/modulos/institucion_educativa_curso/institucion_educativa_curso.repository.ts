import { Injectable } from '@nestjs/common'
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaCursoDto } from './dto/createInstitucionEducativaCurso.dto';
import { UpdateInstitucionEducativaCursoDto } from './dto/updateInstitucionEducativaCurso';

@Injectable()
export class InstitucionEducativaCursoRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(InstitucionEducativaCurso).find();
        
    }
    async getAllBySie(sie:number, gestion:number, periodo:number){
console.log(sie);
console.log(gestion);
console.log(periodo);
        const cursos = await this.dataSource.getRepository(InstitucionEducativaCurso)
        .createQueryBuilder("a")
        //.innerJoinAndSelect("a.educacionTipo", "b")
        .innerJoinAndSelect("a.institucionEducativaSucursal", "s")
        .innerJoinAndSelect("a.turnoTipo", "t")
        .innerJoinAndSelect("a.paraleloTipo", "p")
        .innerJoinAndSelect("a.ofertasAcademicas", "o")
        .innerJoinAndSelect("o.asignaturaTipo", "at")
        .where('a.periodoTipo = :periodo ', { periodo })
        .where('a.gestionTipo = :gestion ', { gestion })
        .where('s.institucionEducativa = :sie ', { sie })
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log("ofertas desde backen");
        console.log(cursos);
        return cursos;
        
    }
    async getAllByEtapa(id:number, gestion:number, periodo:number){
        console.log(id);
        console.log(gestion);
        console.log(periodo);
                const cursos = await this.dataSource.getRepository(InstitucionEducativaCurso)
                .createQueryBuilder("a")
                .innerJoinAndSelect("a.turnoTipo", "t")
                .innerJoinAndSelect("a.paraleloTipo", "p")
                .innerJoinAndSelect("a.ofertasAcademicas", "o")
                .innerJoinAndSelect("o.asignaturaTipo", "at")
                .innerJoinAndSelect("a.etapaEducativa", "e")
                .where('a.periodoTipo = :periodo ', { periodo })
                .where('a.gestionTipo = :gestion ', { gestion })
                .where('e.etapaEducativaId = :id ', { id })
                .orderBy('a.id', 'ASC')
                .getMany();
                console.log("ofertas desde backen");
                console.log(cursos);
                return cursos;
                
            }
    async createCurso(

        dto: CreateInstitucionEducativaCursoDto, 
        transaction: EntityManager
        ) {
        const curso = new InstitucionEducativaCurso();
        curso.gestionTipoId = dto.gestionTipoId;
        curso.turnoTipoId = dto.turnoTipoId;
        curso.etapaEducativaId = dto.etapaEducativaId;
        curso.paraleloTipoId = dto.paraleloTipoId;
        curso.institucionEducativaSucursalId = dto.institucionEducativaSucursalId;
        curso.periodoTipoId = dto.periodoTipoId;
        curso.usuarioId = 1;// dto.usuarioId;

        const result = await transaction.getRepository(InstitucionEducativaCurso).save(curso);
       
        return result;
    }

    async updateCurso(
        dto: UpdateInstitucionEducativaCursoDto, 
        transaction: EntityManager
        ) {
            return transaction.getRepository(InstitucionEducativaCurso)
            .createQueryBuilder()
            .update(InstitucionEducativaCurso)
            .set({
              turnoTipoId: dto.turnoTipoId,
              paraleloTipoId: dto.paraleloTipoId,
            })
            .where({ id: dto.id })
            .execute()
    }

    async deleteCursoOferta(
        id: number, 
        transaction: EntityManager){
        
        await  transaction
         .getRepository(OfertaAcademica)
         .createQueryBuilder('OfertaAcademica')
         .delete()
         .from(OfertaAcademica)
         .where('institucion_educativa_curso_id = :id', { id:id })
         .execute();
         
       return await  transaction.getRepository(InstitucionEducativaCurso).delete(id)

    }
    
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
