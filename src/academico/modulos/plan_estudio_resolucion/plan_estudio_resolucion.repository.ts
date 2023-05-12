import { Injectable } from '@nestjs/common'
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateCarreraAutorizadaResolucionDto } from '../carrera_autorizada_resolucion/dto/createCarreraAutorizadaResolucion.dto';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';

@Injectable()
export class PlanEstudioResolucionRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(PlanEstudioResolucion).find();
        
    }
    async getResolucionesAll(){
        return  await this.dataSource.getRepository(PlanEstudioResolucion).find();
        
    }
    async crearPlanEstudioResolucion(
        dto: CreatePlanEstudioResolucionDto,
        transaction: EntityManager,
        ) {
            const per = new PlanEstudioResolucion();
            per.numeroResolucion = dto.numero_resolucion;
            per.fechaResolucion = dto.fecha_resolucion;
            per.descripcion = dto.descripcion;
            per.activo = true;
            per.usuarioId = 1;
            const result = await transaction.getRepository(PlanEstudioResolucion).save(per);
       
        return result;
    }

    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
