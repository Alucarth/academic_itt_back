import { Inject, Injectable } from "@nestjs/common";
import { MatriculaEstudiante } from "src/academico/entidades/matriculaEstudiante.entity";
import { Repository } from "typeorm";

@Injectable()
export class MatriculaEstudianteService{
    constructor(
        @Inject('MATRICULA_ESTUDIANTE_REPOSITORY')
        private matriculaEstudianteRepository: Repository<MatriculaEstudiante>,
    ) {}

    async findAll(): Promise <MatriculaEstudiante[]>
    {
        return await this.matriculaEstudianteRepository.find()
    }
    async getMatriculadosByPlan(plan_estudio_carrera_id: number): Promise <MatriculaEstudiante[]>
    {
        return await this.matriculaEstudianteRepository.find({
            relations: {
                institucionEducativaEstudiante:{
                    persona:true
                } 
            },
            where:{
                institutoPlanEstudioCarreraId: plan_estudio_carrera_id
            }
        })
    }
}