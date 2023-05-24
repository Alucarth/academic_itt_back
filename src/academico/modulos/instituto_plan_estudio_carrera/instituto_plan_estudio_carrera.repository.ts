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
        const dato = await this.dataSource.getRepository(InstitutoPlanEstudioCarrera).findOneBy(id);
        return dato;
    }

    async findResolucionesCarreraAutorizadaId( id:number){
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
            'pa.horas',
            'rg.id',
            'rg.regimenGrado',
            'a.asignatura',
            'a.abreviacion',
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
        institutoPlan.usuarioId = 1;
        
        
      return await transaction.getRepository(InstitutoPlanEstudioCarrera).save(institutoPlan)
  }
  async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
    return this.dataSource.manager.transaction<T>(op)
}
}
