import { Injectable } from '@nestjs/common'
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { DataSource, EntityManager } from 'typeorm'


@Injectable()
export class PlanEstudioAsignaturaRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(PlanEstudioAsignatura).find();
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

    /*
    async getAsignaturasByPLanEstudioUId(){
        return  await this.dataSource.getRepository(PlanEstudioAsignatura).find({planEstudioCarrera});
    }*/
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

    
  
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
