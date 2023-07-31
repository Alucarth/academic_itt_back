import { Injectable } from '@nestjs/common'
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { DataSource, EntityManager } from 'typeorm'
import { UpdatePlanEstudioAsignaturaDto } from './dto/updatePlanEstudioAsignatura.dto';
@Injectable()
export class PlanEstudioAsignaturaRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(PlanEstudioAsignatura).find();
    }
    async getOneById(id:number){
        return  await this.dataSource.getRepository(PlanEstudioAsignatura).findOneBy({
            'id':id
        });
    }

    async findAsignaturasPrerequisitosByPlan( id:number){
        const asignaturas = await this.dataSource.getRepository(PlanEstudioAsignatura)
        .createQueryBuilder("p")
        .innerJoinAndSelect("p.asignaturaTipo", "a")       
        .innerJoinAndSelect("p.regimenGradoTipo", "rg")     
        .leftJoinAndSelect("p.planesAsignaturasReglas", "r")     
        .innerJoinAndSelect("r.anterior_plan_estudio", "r")     
        .select([
            'p.id as plan_estudio_asignatura_id',
            'p.horas as horas',
            'a.asignatura as asignatura',
            'a.abreviacion as abreviacion',
            'r.id',            
            'r.anteriorPlanEstudioAsignatura',
        ])
        .where('p.planEstudioCarreraId = :id ', { id })
        
        .orderBy('a.id', 'ASC')
        .getRawMany();
        return asignaturas;
    }

    async findAsignaturasByPlanRegimen( id:number, regimen:number){
        const asignaturas = await this.dataSource.getRepository(PlanEstudioAsignatura)
        .createQueryBuilder("p")
        .leftJoinAndSelect("p.asignaturaTipo", "a")       
        .leftJoinAndSelect("p.regimenGradoTipo", "rg")     
        .select([
            'p.id as plan_estudio_asignatura_id',
            'p.horas as horas',
            'a.asignatura as asignatura',
            'a.abreviacion as abreviacion',
        ])
        .where('p.planEstudioCarreraId = :id ', { id })
        .andWhere('p.regimenGradoTipoId = :regimen ', { regimen })
        .orderBy('a.id', 'ASC')
        .getRawMany();
        return asignaturas;
    }
    async findOneByPlanAsignatura( id:number, asignatura:number){
        const pea = await this.dataSource.getRepository(PlanEstudioAsignatura)
        .createQueryBuilder("p")
        .select(['p.id'])
        .where('p.planEstudioCarreraId = :id ', { id })
        .andWhere('p.asignaturaTipoId = :asignatura ', { asignatura })
        .getOne();
        return pea;
    }

    
    async getAsignaturasByPLanEstudioId(id){
        return  await this.dataSource.getRepository(PlanEstudioAsignatura)
        .createQueryBuilder("pa")
        .select([
            'pa.id as id',
            'pa.planEstudioCarreraId as plan_estudio_carrera_id',
            'pa.regimenGradoTipoId as regimen_grado_tipo_id',
            'pa.asignaturaTipoId as asignatura_tipo_id',
        ])
        .where('pa.planEstudioCarreraId = :id', {id})
        .getRawMany();
    }
    async crearPlanEstudioAsignatura(idUsuario, asignaturas, transaction) {

        const planesAsignaturas: PlanEstudioAsignatura[] = asignaturas.map((item) => {
          
          const planAsignatura  = new PlanEstudioAsignatura()
          planAsignatura.planEstudioCarreraId =item.plan_estudio_carrera_id;
          planAsignatura.regimenGradoTipoId =item.regimen_grado_tipo_id;
          planAsignatura.asignaturaTipoId =item.asignatura_tipo_id;
          planAsignatura.horas =item.horas;
          planAsignatura.usuarioId =idUsuario;
          return planAsignatura;
        });
    
        return await transaction.getRepository(PlanEstudioAsignatura).save(planesAsignaturas)
    }
    async crearOnePlanEstudioAsignatura(idUsuario, asignatura, transaction) {

       // const planesAsignaturas: PlanEstudioAsignatura[] = asignaturas.map((item) => {
          const planAsignatura  = new PlanEstudioAsignatura()
          planAsignatura.planEstudioCarreraId =asignatura.plan_estudio_carrera_id;
          planAsignatura.regimenGradoTipoId =asignatura.regimen_grado_tipo_id;
          planAsignatura.asignaturaTipoId =asignatura.asignatura_tipo_id;
          planAsignatura.horas =asignatura.horas;
          planAsignatura.usuarioId =idUsuario;
        //  return planAsignatura;
        //});
    
        return await transaction.getRepository(PlanEstudioAsignatura).save(planAsignatura)
    }

    async updatePlanAsignaturaById(id:number,dto: UpdatePlanEstudioAsignaturaDto) {
       
        return await this.dataSource
        .createQueryBuilder()
        .update(PlanEstudioAsignatura)
        .set({
            horas : dto.horas,
        })
        .where({ id: id })
        .execute(); 
    }
  
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
