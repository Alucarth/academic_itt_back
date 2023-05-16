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
