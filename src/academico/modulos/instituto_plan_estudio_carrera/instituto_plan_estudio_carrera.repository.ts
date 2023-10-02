import { Injectable } from '@nestjs/common'
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateInstitucionEducativaDto } from '../institucion_educativa/dto/createInstitucionEducativa.dto';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';


@Injectable()
export class InstitutoPlanEstudioCarreraRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        const itt = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).find();
        return itt;
    }
    async findOneById(id){
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).findOneBy({'id':id});
        return dato;
    }
    async findGradosBy(id){
        //const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).findGradosBy({'id':id});
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")    
        .innerJoinAndSelect("pe.planesAsignaturas", "pa")    
        .innerJoinAndSelect("pa.asignaturaTipo", "a")    
        .innerJoinAndSelect("pa.regimenGradoTipo", "r")
        .select([
            'r.id as id',      
            'r.regimenGrado as regimen_grado'      
        ])
        .where('ip.id = :id ', { id })
        .groupBy('r.id')
        .orderBy('r.id','ASC')
        .getRawMany() 
        return dato;
    }

    async findAsignaturasGradoBy(id, grado){
        //const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).findGradosBy({'id':id});
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")    
        .innerJoinAndSelect("pe.planesAsignaturas", "pa")    
        .innerJoinAndSelect("pa.asignaturaTipo", "a")    
        .innerJoinAndSelect("pa.regimenGradoTipo", "r")
        .select([
            'pa.id as plan_estudio_asignatura_id',      
            'a.asignatura as asignatura',      
            'a.abreviacion as abreviacion',      
            'a.id as asignatura_tipo_id'      
        ])
        .where('ip.id = :id ', { id })
        .andWhere('pa.regimenGradoTipoId = :grado ', { grado })
        .orderBy('pa.id','ASC')
        .getRawMany() 
        return dato;
    }

    async findOneByPlanCarrera(plan_id, carrera_id){
        
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).findOneBy(
            {
                'planEstudioCarreraId':plan_id,
                'carreraAutorizadaId':carrera_id,
        });
        return dato;
    }
    async findCarreraAutorizadaResolucion(resolucion_id, carrera_id){
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")       
        .innerJoinAndSelect("pe.planEstudioResolucion", "pr")  
        .leftJoinAndSelect("ip.ofertasCurriculares", "o")  
        .leftJoinAndSelect("ip.matriculasEstudiantes", "m")  
        .select([
            'ip.id',
            'ip.observacion',
            'ip.activo',
            'pe.id',
            'pr.id',
            'pr.numeroResolucion',
            'pr.fechaResolucion',
            'pr.descripcion',
            'pr.activo',
            'o.id',
            'm.id',
        ])
        .where('ip.carreraAutorizadaId = :carrera_id ', { carrera_id })
        .andWhere('pe.planEstudioResolucionId = :resolucion_id ', { resolucion_id })
        .getOne();
        return dato;
    }
    async findResolucionesCarreraAutorizadaId( id:number){
        const itt = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")       
        .innerJoinAndSelect("pe.planEstudioResolucion", "pr")       
        .leftJoinAndSelect("pe.planesAsignaturas", "pa")       
        .leftJoinAndSelect("pe.planesSeguimientos", "ps")       
        // .leftJoinAndSelect("ps.procesoTipo", "pt") 
        .leftJoinAndSelect("pe.estadoInstituto","ie")
        .leftJoinAndSelect("pa.regimenGradoTipo", "rg")     
        .leftJoinAndSelect("pa.asignaturaTipo", "a")       
        .leftJoinAndSelect("pa.planesAsignaturasReglas", "r")       
        .leftJoinAndSelect("r.anteriorPlanEstudioAsignatura", "an")       
        .leftJoinAndSelect("an.asignaturaTipo", "a2")       
        .select([
            'ip.id',
            'ip.observacion',
            'pe.id',
            'pe.denominacion',
            'pe.descripcion',
            'pr.id',
            'pr.numeroResolucion',
            'pr.fechaResolucion',
            'pr.descripcion',
            'pe.aprobado',
            'ie.estado',
            'pr.activo',
            'pa.horas',
            'rg.id',
            'rg.regimenGrado',
            'a.asignatura',
            'a.abreviacion',
            'r.id',
            'an.id',
            'a2.abreviacion',
            'ps.id',
            // 'pt.proceso',
            
            
        ])
        .where('ip.carreraAutorizadaId = :id ', { id })
        .orderBy('rg.id', 'ASC')
        //.orderBy('a.id', 'ASC')
        .getMany();
        return itt;
    }


    async findPlanAsignaturasById( id:number){
        const itt = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera)
        .createQueryBuilder("ip")
        .innerJoinAndSelect("ip.planEstudioCarrera", "pe")       
        .innerJoinAndSelect("pe.planEstudioResolucion", "pr")       
        .leftJoinAndSelect("pe.planesAsignaturas", "pa")       
        .leftJoinAndSelect("pa.regimenGradoTipo", "rg")     
        .leftJoinAndSelect("pa.asignaturaTipo", "a")       
          
        .select([
            'ip.id',
            'ip.observacion',
            'pe.id',
            'pr.id',
            'pr.numeroResolucion',
            'pr.fechaResolucion',
            'pr.descripcion',
            'pr.activo',
            'pa.id',
            'pa.horas',
            'rg.id',
            'rg.regimenGrado',
            'a.asignatura',
            'a.abreviacion',
        ])
        .where('ip.id = :id ', { id })
        .orderBy('rg.id', 'ASC')
        //.orderBy('a.id', 'ASC')
        .getMany();
        return itt;
    }

 async createInstitutoPlanEstudioCarrera(idUsuario,dto:CreateInstitutoPlanEstudioCarreraDto, transaction) {
          
        const institutoPlan  = new InstitutoPlanEstudioCarrera()
        institutoPlan.planEstudioCarreraId = dto.plan_estudio_carrera_id;
        institutoPlan.carreraAutorizadaId = dto.carrera_autorizada_id;
        institutoPlan.activo = true;
        institutoPlan.observacion = 'ASIGNACION';
        institutoPlan.usuarioId = idUsuario;
        
        
      return await transaction.getRepository(InstitutoPlanEstudioCarrera).save(institutoPlan)
  }
  async deleteAsignacion(id: number) {
    return await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).delete(id)
}
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
}
}
