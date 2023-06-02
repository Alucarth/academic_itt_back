import { Injectable } from '@nestjs/common'
import { AsignaturaTipo } from 'src/academico/entidades/asignaturaTipo.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { PlanEstudioAsignaturaRegla } from 'src/academico/entidades/planEstudioAsignaturaRegla.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class PlanEstudioAsignaturaReglaRepository {
   
    constructor(private dataSource: DataSource) {}

   

    async createPlanEstudioAsignaturaRegla(
        usuario_id,
        plan_id,
        anterior_id,
        transaction) {
        
        const pear  = new PlanEstudioAsignaturaRegla();
        pear.planEstudioAsignaturaId = plan_id;
        pear.anteriorPlanEstudioAsignaturaId = anterior_id;
        pear.usuarioId = usuario_id,
        pear.activo = true
        return await transaction.getRepository(PlanEstudioAsignaturaRegla).save(pear);
    }
  
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
